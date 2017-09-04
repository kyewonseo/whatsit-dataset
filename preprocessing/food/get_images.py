import gspread
import os
import shutil
import urllib.request
from PIL import Image
from oauth2client.service_account import ServiceAccountCredentials
from xml.etree.ElementTree import Element, ElementTree



CLIENT_SECRET = 'whatsit-47b0dd63f334.json'
SPREAD_KEY = '1gqUXGiY9I0gxPYg_M3gr_alrUtqJb71uDbtJoexehf0'

FOLDER_NAME = 'KOR_FOODS'
DATASET_DIR = '/tmp/' + SPREAD_KEY + '/' + FOLDER_NAME

def get_data():
    # use creds to create a client to interact with the Google Drive API
    scope = ['https://spreadsheets.google.com/feeds']
    creds = ServiceAccountCredentials.from_json_keyfile_name(CLIENT_SECRET, scope)
    client = gspread.authorize(creds)

    # Find a workbook by name and open the first sheet
    # Make sure you use the right name here.
    sheet = client.open_by_key(SPREAD_KEY).sheet1
    # Extract and print all of the values
    list_of_hashes = sheet.get_all_records()
    return list_of_hashes

def generate_annotation(file_name, object_name, full_name):

    annotation = Element("annotation")
    folder = Element("folder")
    folder.text = 'KOR_FOODS'
    filename = Element("filename")
    filename.text = file_name + '.jpg'
    source = Element("source")

    database = Element("database")
    database.text = "KOREAN Food Database"
    annotation2 = Element("annotation")
    annotation2.text = "BlueHack"
    image = Element("image")
    image.text = "bluehack"
    source.append(database)
    source.append(annotation2)
    source.append(image)

    annotation.append(folder)
    annotation.append(filename)
    annotation.append(source)

    im = Image.open(full_name)
    w, h = im.size

    size = Element("size")
    width = Element("width")
    width.text = str(w)
    height = Element("height")
    height.text = str(h)
    depth = Element("depth")
    depth.text = '3'
    size.append(width)
    size.append(height)
    size.append(depth)
    annotation.append(size)

    segmented = Element("segmented")
    segmented.text = '0'
    annotation.append(segmented)

    object = Element("object")
    name = Element("name")
    name.text = object_name
    pose = Element("pose")
    pose.text = 'Frontal'
    truncated = Element("truncated")
    truncated.text = '0'
    difficult = Element("difficult")
    difficult.text = '0'
    bndbox = Element("bndbox")
    xmin = Element("xmin")
    ymin = Element("ymin")
    xmax = Element("xmax")
    ymax = Element("ymax")
    xmin.text = '0'
    ymin.text = '0'
    xmax.text = str(w)
    ymax.text = str(h)
    bndbox.append(xmin)
    bndbox.append(ymin)
    bndbox.append(xmax)
    bndbox.append(ymax)
    object.append(name)
    object.append(pose)
    object.append(truncated)
    object.append(difficult)
    object.append(bndbox)

    annotation.append(object)
    ElementTree(annotation).write(open(DATASET_DIR + '/Annotations/' + file_name + '.xml', 'wb'))


def download_image(filename, url):
    try:
        download_name = DATASET_DIR + '/DownloadImages/' + filename
        new_name = DATASET_DIR + '/JPEGImages/' + filename
        urllib.request.urlretrieve(url, download_name)
        im = Image.open(download_name)
        im.convert('RGB').save(new_name)
        return new_name
    except urllib.error.URLError as e:
        print(url)
        print(e.reason)
    except UnicodeEncodeError as eu:
        print(url)
        print(eu.reason)

def make_directories():
    if os.path.exists(DATASET_DIR):
        shutil.rmtree(DATASET_DIR)
    os.makedirs(DATASET_DIR)

    for path in ['Annotations','ImageSets', 'DownloadImages', 'RawImages', 'JPEGImages']:
        os.makedirs(DATASET_DIR + '/' + path)
        if path == 'ImageSets':
            os.makedirs(DATASET_DIR + '/' + path + '/' + 'Main')

def clean_directories():
    download_images = DATASET_DIR + '/DownloadImages'
    raw_images = DATASET_DIR + '/RawImages'
    if os.path.exists(download_images):
        shutil.rmtree(download_images)
    if os.path.exists(raw_images):
        shutil.rmtree(raw_images)

def generate_imageset(name, data_category):
    full_file = DATASET_DIR + '/ImageSets/Main/food_all_trainval.txt'
    train_file = DATASET_DIR + '/ImageSets/Main/food_all_train.txt'
    val_file = DATASET_DIR + '/ImageSets/Main/food_all_val.txt'

    if data_catetory == 'train':
        write_imagename(train_file, name)
    else:
        write_imagename(val_file, name)

    write_imagename(full_file, name)

def write_imagename(file, name):
    f = open(file, 'a')
    f.write(name + '\n')
    f.close()

if __name__ == '__main__':
    make_directories()
    list = get_data()
    for data in list:
        food_code = data['food_code']
        food_number = data['food_number']
        file_name = data['category_code'] + '_' + str(food_code) + '_' + str(food_number)

        data_catetory = 'train'

        if food_number % 2 is 0:
            data_catetory = 'val'

        try:
            full_name = download_image(file_name + '.jpg', data['image_url'])
            generate_annotation(file_name, str(food_code), full_name)
            generate_imageset(file_name, data_catetory)
        except AttributeError as e:
            continue
            print(e)

    clean_directories()
