#!/bin/bash

API="http://localhost:4741"
URL_PATH="/post-artwork"

curl "${API}${URL_PATH}" \
  --include \
  --header "Authorization: Token token=${TOKEN}" \
  --request POST \
  -F "image=@../tiny-cat.jpg" \
  -F "name=Tiny cat 2" \
  -F "description=Tiny pic of tiny cat" \

  echo
