import fnmatch
import re

blocked_domains = []


def rule_to_regex(rule):
    """
    Convert AdBlock rule to a regular expression.
    """

    # escape special regex characters
    rule = re.sub(r"([.$+?{}()\[\]\\])", r"\\\1", rule)

    # XXX: the resulting regex must use non-capturing groups (?:
    # for performance reasons; also, there is a limit on number
    # of capturing groups, no using them would prevent building
    # a single regex out of several rules.

    # Separator character ^ matches anything but a letter, a digit, or
    # one of the following: _ - . %. The end of the address is also
    # accepted as separator.
    rule = rule.replace("^", "(?:[^\w\d_\-.%]|$)")

    # * symbol
    rule = rule.replace("*", ".*")

    # | in the end means the end of the address
    if rule[-1] == '|':
        rule = rule[:-1] + '$'

    # || in the beginning means beginning of the domain name
    if rule[:2] == '||':
        # XXX: it is better to use urlparse for such things,
        # but urlparse doesn't give us a single regex.
        # Regex is based on http://tools.ietf.org/html/rfc3986#appendix-B
        if len(rule) > 2:
            #          |            | complete part     |
            #          |  scheme    | of the domain     |
            rule = r"^(?:[^:/?#]+:)?(?://(?:[^/?#]*\.)?)?" + rule[2:]

    elif rule[0] == '|':
        # | in the beginning means start of the address
        rule = '^' + rule[1:]

    # other | symbols should be escaped
    # we have "|$" in our regexp - do not touch it
    rule = re.sub("(\|)[^$]", r"\|", rule)

    return rule


with open('adblock.txt') as f:
    for line in f:
        line = line.rstrip("\n")
        if(line.startswith('||')):
            host = line[2:-1]
            host = "*://*." + line[2:-1] + "/*"
            # host = fnmatch.translate(host)
            # host = rule_to_regex(line)
            blocked_domains.append(host)

with open('blocked_domains.js', 'w') as f:
    f.write("var blocked_domains = [\n")
    for host in blocked_domains:
        f.write("'" + host + "',\n")
    f.write("];")
