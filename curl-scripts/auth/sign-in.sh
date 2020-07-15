#!/bin/bash

API="http://localhost:4741"
URL_PATH="/sign-in"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "name": "",
      "email": "'"${EMAIL}"'",
      "password": "'"${PASSWORD}"'",
      "password_confirmation": "'"${PASSWORD}"'",
      "location": "",
      "biography": "",
      "artwork": ""
    }
  }'

echo
