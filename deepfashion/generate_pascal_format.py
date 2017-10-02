import os
import shutil
import urllib.request
from PIL import Image
import errno
import re
from xml.etree.ElementTree import Element, ElementTree

DEEPFASHION_DIR = '/dataset/img'
ROOT_DIR = '/tmp/deepfashion'
DATASET_DIR = os.path.join(ROOT_DIR, 'dataset')
DATA_DIR = os.path.join(ROOT_DIR, 'data')
MODELS_DIR = os.path.join(ROOT_DIR, 'models')

BBOX_FILE = './list_bbox.txt'
# CATEGORY_CLOTH_FILE = './list_category_cloth.txt'
CATEGORY_CLOTH_FILE = './list_class.txt'
CATEGORY_IMG_FILE = './list_category_img.txt'
EVAL_PARTITION_FILE = './list_eval_partition.txt'
LABEL_MAP_FILE = 'label_map.pbtxt'


def generate_annotation():
  f_category = open(CATEGORY_CLOTH_FILE, 'r')
  category_lines = f_category.readlines()
  category_dic = {}
  for category in category_lines:
    c_map = re.sub('\\n$', '', category).strip().split()
    category_dic[c_map[0]] = c_map[1]
  f_category.close()

  # f_category = open(CATEGORY_CLOTH_FILE, 'r')
  # category_lines = f_category.readlines()
  # categories = []
  # for category in category_lines:
  #   categories.append(re.sub('\\n$', '', category).strip().split()[0])
  # f_category.close()

  f_category_img_map = open(CATEGORY_IMG_FILE, 'r')
  category_img_lines = f_category_img_map.readlines()
  category_img_dic = {}
  for pair in category_img_lines:
    map = pair.strip().split()
    category_img_dic[map[0]] = map[1]
  f_category_img_map.close()

  f = open(BBOX_FILE, 'r')
  lines = f.readlines()
  for line in lines:
    colum = line.strip().split()
    img = colum[0]
    x_1 = colum[1]
    y_1 = colum[2]
    x_2 = colum[3]
    y_2 = colum[4]

    annotation = Element("annotation")
    folder = Element("folder")
    folder.text = 'dataset'
    filename = Element("filename")
    filename.text = img
    source = Element("source")

    database = Element("database")
    database.text = "Fashion Database"
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

    im = Image.open(os.path.join(DATASET_DIR, 'JPEGImages', img))
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
    name.text = category_dic[category_img_dic[img]]
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
    xmin.text = x_1
    ymin.text = y_1
    xmax.text = x_2
    ymax.text = y_2
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
    xml_file = re.sub('\.jpg$', '', os.path.join(DATASET_DIR, 'Annotations', img)) + '.xml'

    if not os.path.exists(os.path.dirname(xml_file)):
      try:
        os.makedirs(os.path.dirname(xml_file))
      except OSError as exc:  # Guard against race condition
        if exc.errno != errno.EEXIST:
          raise
    ElementTree(annotation).write(open(xml_file, 'wb'))
  f.close()


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
  if os.path.exists(DATA_DIR):
    shutil.rmtree(DATA_DIR)

  if os.path.exists(MODELS_DIR):
    shutil.rmtree(MODELS_DIR)

  if os.path.exists(DATASET_DIR):
    shutil.rmtree(DATASET_DIR)

  os.makedirs(DATASET_DIR)
  os.makedirs(DATA_DIR)
  os.makedirs(MODELS_DIR)

  for path in ['Annotations','ImageSets', 'JPEGImages']:
    os.makedirs(DATASET_DIR + '/' + path)
    if path == 'ImageSets':
      os.makedirs(os.path.join(DATASET_DIR, path, 'Main'))

def generate_imageset():

  f_category = open(CATEGORY_CLOTH_FILE, 'r')
  category_lines = f_category.readlines()
  category_dic = {}
  for category in category_lines:
    c_map = re.sub('\\n$', '', category).strip().split()
    category_dic[c_map[0]] = c_map[3]
  f_category.close()

  f_category_img_map = open(CATEGORY_IMG_FILE, 'r')
  category_img_lines = f_category_img_map.readlines()
  category_img_dic = {}
  for pair in category_img_lines:
    map = pair.strip().split()
    category_img_dic[map[0]] = map[1]
  f_category_img_map.close()

  f = open(EVAL_PARTITION_FILE, 'r')
  lines = f.readlines()

  f_train = open(os.path.join(DATASET_DIR, 'ImageSets', 'Main', 'train.txt'), 'w')
  f_val = open(os.path.join(DATASET_DIR, 'ImageSets', 'Main', 'val.txt'), 'w')
  f_test = open(os.path.join(DATASET_DIR, 'ImageSets', 'Main', 'test.txt'), 'w')
  for line in lines:
    partition = line.strip().split()

    if int(category_dic[category_img_dic[partition[0]]]) == 1:
      if partition[1] == 'train':
        f_train.write(line.strip().split()[0] + '\n')
      elif partition[1] == 'val':
        f_val.write(line.strip().split()[0] + '\n')
      elif partition[1] == 'test':
        f_test.write(line.strip().split()[0] + '\n')
  f.close()
  f_train.close()
  f_val.close()
  f_test.close()

def generate_labelmap():
  f_category = open(CATEGORY_CLOTH_FILE, 'r')
  lines = f_category.readlines()

  f_label_map = open(os.path.join(DATA_DIR, 'label_map.pbtxt'), 'w')
  for idx, val in enumerate(lines):
    idx = idx + 1
    f_label_map.write('item {\n')
    f_label_map.write('  id: ' + str(idx) + '\n')
    f_label_map.write('  name: ' + '\'' + re.sub('\\n$', '', val.strip()) + '\'\n')
    f_label_map.write('}\n')
  f_category.close()
  f_label_map.close()

def read_bbox():
  print(read_bbox)

def copy_images():
  target_dir = os.path.join(DATASET_DIR, 'JPEGImages', 'img')
  shutil.copytree(DEEPFASHION_DIR, target_dir)


if __name__ == '__main__':
  make_directories()
  copy_images()
  generate_annotation()
  generate_imageset()
  generate_labelmap()
