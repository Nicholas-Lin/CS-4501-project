from os import write
from invalid_domains import invalid_domains
from multiprocessing.pool import ThreadPool as Pool
import whois
import timeit

count = 0
blocked_domains = []
blocked_globs = []
blocked_domains_whois = []


def write_to_file(name, data):
    with open(name + '.js', 'w') as f:
        f.write("var " + name + " = [\n")
        for host in data:
            f.write("'" + host + "',\n")
        f.write("];")


def get_whois_wrapped(host):
    try:
        get_whois(host)
    except:
        print('FAIL AT WRAP')


def get_whois(host):
    status()
    print("working on " + host)
    try:
        domain = whois.query(host)
        if domain.registrant != '' and domain.registrant != 'REDACTED FOR PRIVACY':
            blocked_domains_whois.append([host, domain.registrant])
            with open("test.js", "a") as file_object:
                file_object.write(
                    "'" + host + "': '" + domain.registrant + "',\n")
                file_object.close()
    except:
        print("FAIL: " + host)
    finally:
        print("done: " + host)


def status():
    global count
    count += 1
    done = (count/19524.0) * 100.0
    print(str(done) + " %")


with open('easylist.txt') as f:
    for line in f:
        line = line.rstrip("\n")
        if(line.startswith('||') and line.find('^') > -1):
            host = line[2:line.index('^')]
            if(host not in invalid_domains):
                blocked_domains.append(host)
                glob = "*://*." + line[2:line.index('^')] + "/*"
                blocked_globs.append(glob)

write_to_file('blocked_domains_easy', blocked_domains)
write_to_file('blocked_domains_glob_easy', blocked_globs)

# Note that this program will freeze as it approaches 100%.
# At this point terminate the program and copy test.js into a javascript object
# var = blocked_domains_whois_easy {...} in a file called "blocked_domains_whois_easy.js"

bad_hosts = ['img.servint.net']
pool = Pool(30)
for host in blocked_domains:
    if host in bad_hosts:
        continue
    pool.apply_async(
        get_whois_wrapped,
        args=(host,)
    )
pool.close()
pool.join()


with open('blocked_domains_whois_easy.js', 'w') as f:
    f.write("var blocked_domains_whois_easy = {\n")
    for host in blocked_domains_whois:
        f.write("'" + host[0] + "': '" + host[1] + "',\n")
    f.write("};")
