import gspread
from oauth2client.service_account import ServiceAccountCredentials

CLIENT_SECRET = 'whatsit-10b168f19b4d.json'
SPREAD_KEY = '1SulAI2mtt3Pk2Ao-5k2hmd4Br83QtQUmDbnZqbAj5FA'

# use creds to create a client to interact with the Google Drive API
scope = ['https://spreadsheets.google.com/feeds']
creds = ServiceAccountCredentials.from_json_keyfile_name(CLIENT_SECRET, scope)
client = gspread.authorize(creds)

# Find a workbook by name and open the first sheet
# Make sure you use the right name here.
sheet = client.open_by_key(SPREAD_KEY).sheet1

import matplotlib.pyplot as plt
import matplotlib.image as mpimg
# Extract and print all of the values
list_of_hashes = sheet.get_all_records()
for row in list_of_hashes:
    img=mpimg.imread(row['URL'])
    imgplot = plt.imshow(img)
    plt.show()
    print(row)






