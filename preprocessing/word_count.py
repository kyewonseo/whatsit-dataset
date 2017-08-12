import re
import string

frequency = {}
document_text = open('food_names.csv', 'r')
text_string = document_text.read().lower()
regex = r'[가-힣]+'
match_pattern = re.findall(regex, text_string)

for word in match_pattern:
    count = frequency.get(word, 0)
    frequency[word] = count + 1

frequency_list = frequency.keys()

for words in frequency_list:
    print(words, frequency[words])