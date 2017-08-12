import csv

from google.cloud import bigquery
from google.cloud.bigquery import SchemaField

client = bigquery.Client()

dataset = client.dataset('foods')
dataset.create()  # API request

SCHEMA = [
    SchemaField('url', 'STRING', mode='required'),
    SchemaField('rawLabels', 'STRING', mode='required'),
    SchemaField('newLabels', 'STRING', mode='required'),
]
table = dataset.table('table_name', SCHEMA)
table.create()

with open('bok.csv', 'rb') as readable:
    table.upload_from_file(
        readable, source_format='CSV', skip_leading_rows=1)