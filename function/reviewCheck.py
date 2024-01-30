import requests
from pprint import pprint


def aichecker(mytext):
    response = requests.post(
        "https://api.sapling.ai/api/v1/aidetect",
        json={"key": "4KUJMMC886VPWQMQUOW2MRNEZLX0REFQ", "text": mytext},
    )
    response_Dict = response.json()
    score = response_Dict["score"]

    return round(score * 100, 2)
