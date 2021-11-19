import functools
import logging


def silence_errors(func):
    @functools.wraps(func)
    def wrapper_silence_errors(*args, **kwargs):
        try:
            logging.disable(logging.ERROR)
            func(*args, **kwargs)
        finally:
            logging.disable(logging.NOTSET)
    return wrapper_silence_errors


def get_file_download_tokens(response):
    # Returns all downloadTokens for a bilbyResultFiles response where the file is not a directory

    download_tokens = [
        f['downloadToken']
        for f in filter(lambda x: not x['isDir'], response.data['bilbyResultFiles']['files'])
    ]
    return download_tokens


def get_files(response):
    # Returns all files for a bilbyResultFiles response where the file is not a directory

    files = [
        f
        for f in filter(lambda x: not x['isDir'], response.data['bilbyResultFiles']['files'])
    ]
    return files
