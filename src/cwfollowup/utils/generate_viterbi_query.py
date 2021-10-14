from graphql.language.printer import print_ast
from graphql.language.ast import Document, FragmentSpread


def get_variables_recursive(field_ast, fragments, variables=[]):
    """Recursively gets used variables within a GraphQL AST node"""
    if hasattr(field_ast, 'arguments'):
        variables.extend(
            [arg.value for arg in field_ast.arguments]
        )

    if field_ast.selection_set:
        for selection in field_ast.selection_set.selections:
            if isinstance(selection, FragmentSpread):
                selection = fragments.get(selection.name.value)
            variables = get_variables_recursive(selection, fragments, variables=variables)

    return variables


def get_fragment_spreads_recursive(field_ast, fragments, fragment_spreads=[]):
    """Recursively gets used fragments within a GraphQL AST node"""
    if field_ast.selection_set:
        for selection in field_ast.selection_set.selections:
            if isinstance(selection, FragmentSpread):
                fragment_spreads.append(
                    selection.name.value
                )
                selection = fragments.get(selection.name.value)
            fragment_spreads = get_fragment_spreads_recursive(selection, fragments, fragment_spreads=fragment_spreads)

    return fragment_spreads


def get_variables_definitions_subset(operation, field_ast, fragments):
    """Obtains the subset of variables in the original query that appear within the field AST"""
    variables = get_variables_recursive(field_ast, fragments)
    return list(
        filter(
            lambda var_def: var_def.variable in variables,
            operation.variable_definitions
        )
    )


def get_fragments_subset(field_ast, fragments):
    """Obtains the fragments that are used within the field"""
    fragment_spreads = get_fragment_spreads_recursive(field_ast, fragments)
    return [fragment for name, fragment in fragments.items() if name in fragment_spreads]


def generate_viterbi_query(info):
    """Generates a query for the viterbi module from the ResolveInfo object"""
    operation = info.operation
    fragments = info.fragments
    for name, fragment in fragments.items():
        if fragment.type_condition.name.value == 'Viterbi':
            fragment.type_condition.name.value = 'Query'

    variables_set = set()
    selections_set = set()
    fragments_set = set()

    for field_ast in info.field_asts:
        variables_set.update(get_variables_definitions_subset(operation, field_ast, fragments))
        selections_set.update(field_ast.selection_set.selections)
        fragments_set.update(get_fragments_subset(field_ast, fragments))

    operation.variable_definitions = list(variables_set)
    operation.selection_set.selections = list(selections_set)
    fragments = list(fragments_set)
    doc = Document(definitions=[operation, *fragments])
    return print_ast(doc)
