import numpy as np
import pandas as pd

filename = './bok.csv'
df = pd.read_csv(filename, names=['url', 'labels', 'new'], header=None)
print(df)

projectid='whatsit-174908'
df.to_gbq('my_dataset.my_table', projectid)