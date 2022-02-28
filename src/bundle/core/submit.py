import json
import os
from pathlib import Path

from core.misc import working_directory
from db import get_unique_job_id, update_job
from scheduler.slurm import slurm_submit


def submit_template(submit_dir, job_name, followups):
    lines = [
        f"""#!/bin/bash
#SBATCH --time=00:10:00
#SBATCH --output={submit_dir}/{job_name}_master_slurm.out
#SBATCH --error={submit_dir}/{job_name}_master_slurm.err"""
    ]

    for i, followup in enumerate(followups):
        jid = f'jid{i}'
        lines.append(
            f"""{jid}=($(sbatch {submit_dir}/{job_name}_{followup}.sh))
echo "{jid} ${{{jid}[-1]}}" >> {submit_dir}/slurm_ids"""
        )

    return '\n\n'.join(lines)


def generic_followup_script_template(submit_dir, followup_results_dir, job_name, followup):
    return f"""#!/bin/bash
#SBATCH --job-name={job_name}_{followup}
#SBATCH --account=oz986
#SBATCH --ntasks=1
#SBATCH --time=01:00:00
#SBATCH --mem-per-cpu=8GB
#SBATCH --tmp=8GB
#SBATCH --cpus-per-task=1
#SBATCH --output={followup_results_dir}/{job_name}_{followup}.out
#SBATCH --error={followup_results_dir}/{job_name}_{followup}.err

module load gcc/6.4.0 python/3.7.4
. /fred/oz986/cwfollowup/lalapps/module_env.sh
. /fred/oz986/cwfollowup/bundle/{followup}/venv/bin/activate
. /fred/oz986/cwfollowup/lalapps/v7.0.0/etc/lal-user-env.sh

python /fred/oz986/cwfollowup/{followup}/{followup}.py {submit_dir}/{job_name}_{followup}.json"""


def generic_followup_json(followup_results_dir, candidates, followup):
    return {
        'candidates': candidates,
        'path': str(followup_results_dir),
        'script_path': f'/fred/oz986/cwfollowup/{followup}'
    }

def submit(details, input_params):
    print("Submitting new job...")

    # Convert the job data to a json object
    input_params = json.loads(input_params)

    # Get the working directory
    wk_dir = working_directory(details, input_params)
    wk_dir = Path(wk_dir).resolve()

    wk_dir.mkdir(parents=True, exist_ok=True)

    # Change to the working directory
    os.chdir(wk_dir)

    # Create the necessary directories
    submit_directory = 'submit'
    submit_dir = wk_dir / submit_directory
    submit_dir.mkdir(parents=True, exist_ok=True)

    results_dir = wk_dir / 'cwfollowup'
    results_dir.mkdir(parents=True, exist_ok=True)

    job_name = input_params["name"]

    # Write slurm scripts
    slurm_script = submit_dir / f'{job_name}_master_slurm.sh'
    slurm_script.touch(exist_ok=True)
    slurm_script.write_text(submit_template(submit_dir, job_name, input_params['followups']))

    for followup in input_params['followups']:
        followup_results_dir = results_dir / followup
        followup_results_dir.mkdir(parents=True, exist_ok=True)

        # Create input json for followup
        with Path(submit_dir / f'{job_name}_{followup}.json').open("w+", encoding="utf-8") as f:
            followup_params = generic_followup_json(followup_results_dir, input_params['candidates'], followup)
            json.dump(followup_params, f, ensure_ascii=False, indent=4)

        # Create slurm script for followup
        script = generic_followup_script_template(submit_dir, followup_results_dir, job_name, followup)
        followup_slurm_script = submit_dir / f'{job_name}_{followup}.sh'
        followup_slurm_script.touch()
        followup_slurm_script.write_text(script)

    # Actually submit the job
    submit_bash_id = slurm_submit(slurm_script, wk_dir)

    # If the job was not submitted, simply return. When the job controller does a status update, we'll detect that
    # the job doesn't exist and report an error
    if not submit_bash_id:
        return None

    # Create a new job to store details
    job = {
        'job_id': get_unique_job_id(),
        'submit_id': submit_bash_id,
        'working_directory': str(wk_dir),
        'submit_directory': submit_directory
    }

    # Save the job in the database
    update_job(job)

    # return the job id
    return job['job_id']

