import pandas as pd

filename = './food_image_url_v2.csv'
df = pd.read_csv(filename, names=['url', 'labels', 'new'], header=None)

newcol = ''
df2 = df.assign(new=newcol)

for index, row in df2.iterrows():
    st = row['labels']
    row['new'] = ''
    # print(st)
    print(index)
    if isinstance(st, float):
        # print(st)
        continue
    for ss in st.split(','):
        # print(ss)
        kk = ss.split()
        # print(kk)
        ne = [x for x in kk if not any(c.isdigit() for c in x)]
        # print(ne)
        row['new'] += ''.join(ne)
        row['new'] += ','
        # print(row['new'])

    # print(index, row['labels'], '.....', row['new'])

newfilename = './bok.csv'
with open(newfilename, 'a') as f:
    df2.to_csv(f, header=True, encoding='utf-8')

print(df2)

