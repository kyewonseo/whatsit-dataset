# parser.py
import gspread
import random
from oauth2client.service_account import ServiceAccountCredentials
import time
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
import os

CLIENT_SECRET = 'whatsit-47b0dd63f334.json'
SPREAD_KEY = '1EvWpqGNC964OlsV1Cq-gsOzVeoDLwXLuiSfaFqMFhu0'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
}

scope = ['https://spreadsheets.google.com/feeds']
creds = ServiceAccountCredentials.from_json_keyfile_name(CLIENT_SECRET, scope)
client = gspread.authorize(creds)

# Find a workbook by name and open the first sheet
# Make sure you use the right name here.
sheet = client.open_by_key(SPREAD_KEY).sheet1


def get_data():
    # use creds to create a client to interact with the Google Drive API
    # Extract and print all of the values
    list_of_hashes = sheet.get_all_records()
    return list_of_hashes


def get_search_result(list_of_hashed):
    # HTTP GET Request
    i = 2
    for data in list_of_hashed:

        check = data['google_search']
        if type(check) is int:
            i += 1
            continue

        duplicated = data['duplicated']
        if duplicated == 'TRUE':
            i += 1
            continue

        if (i % 50) is 0:
            time.sleep(10)
        else:
            time.sleep(random.randrange(5, 15))

        query = 'https://www.google.co.kr'

        driver = webdriver.Chrome()
        driver.get(query)
        elem = driver.find_element_by_id('lst-ib')

        keyword = '"' + str(data['fdl_name']) + '"'
        elem.send_keys(keyword)
        elem.submit()

        try:
            ##### 구글 검색 결과 페이지 #####
            result_count_str = driver.find_element_by_id('resultStats').text
            count_str = result_count_str.split('(')
            result_count = ''.join(filter(lambda x: x.isdigit(), count_str[0]))
            print('[' + str(i) + ']' + '[' + keyword + ']:' + str(result_count))
            sheet.update_cell(i, 7, result_count)
            txts = driver.find_element_by_css_selector('#topstuff > div')
            sheet.update_cell(i, 7, 0)
            print('>>>> ' + txts.text)

        except NoSuchElementException as e:
            i += 1
            continue
            print('>>>> ')

        i += 1


if __name__ == '__main__':
    data = get_data()
    get_search_result(data[1000:2000])