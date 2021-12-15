from multiprocessing.pool import ThreadPool as Pool
import whois
import time
start_time = time.time()
blocked_domains_whois = []


def get_whois(host):
    try:
        domain = whois.query(host)
        blocked_domains_whois.append([host, domain.registrant])
    except:
        print("FAIL: " + host)


pool = Pool(30)
blocked_domains_whois = [pool.apply_async(
    get_whois,
    args=(host, ),
    callback=None
) for host in blocked_domains_easy]
pool.close()
pool.join()
print(blocked_domains_whois)
print("--- %s seconds ---" % (time.time() - start_time))
