library(tidyverse)
library(jsonlite)

# dummy data I made up to show flights by week, actual data is sensitive and proprietary.  
# The purpose is to show the cleaning process in R and the data viz in D3
byWeek <- read_csv("byWeek.csv")

# add leading zeros to single digit months and days... some of the current data doesn't include 0 for single digit numbers
# it searches for a digit that either begins the string or follows a forward slash ((^|/)) 
# and is not preceded or followed by other digits (\\b(\\d)\\b)

# \\b is a word boundary, which matches the position between a word character (as defined by the unicode standard) and a non-word character, or between the start/end of the string and a word character/non-word character. 
# In this case, it's used to match only at the beginning or end of a number.
# (\\d) is a capturing group that matches a single digit (0-9) character. The parentheses capture the digit for use later in the regular expression or in the replacement text.
# Finally, \\b is another word boundary, which ensures that only one digit is captured.

byWeek$week <- gsub("(^|/)\\b(\\d)\\b", "\\10\\2", byWeek$week, perl=TRUE)
byWeek$week <- as.Date(byWeek$week, format = "%m/%d/%Y")
byWeek <- byWeek %>% arrange(week)

#convert to json for JavaScript
byWeekJSON <- toJSON(byWeek)
write(byWeekJSON, file = "byWeek.json")
