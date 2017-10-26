
import os
import urllib.request

BASE_URL = 'http://www.sta1.com/home'
CCS_URL = 'http://www.sta1.com/ccs'
if __name__ == '__main__':

  with urllib.request.urlopen(BASE_URL) as home:
    l = home.readline()
    while l:
      if b'sseq("' in l:
      print(l)


  # for i in range(100):
  #   site = os.path.join(CCS_URL, str(i))
  #   # f = urllib.request.urlopen(site)
  #   with urllib.request.urlopen(site) as fp:
  #     line = fp.readline()
  #     while line:
  #       # print(line)
  #       line = fp.readline()
  #       if b'redirect("' in line:
  #         print(line[11:-5])
  #         break

