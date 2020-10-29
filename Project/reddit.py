import requests
# import pandas as pd
import json

bearer_token = "AAAAAAAAAAAAAAAAAAAAAEfOIwEAAAAAzBbjeOoP4XpWEqydXtsOodfiCfk%3DXnDQNejU60wVcxAcJANbk6FosEQEm2yQPyXwuqhFa4pnHxrjkJ"
# df = pd.read_csv("corona_tweets_01.csv")

head = {'Authorization': f'Bearer {bearer_token}',
        'Content-type': 'application/json'}
url = "https://api.twitter.com/2/tweets/search/stream/rules?dry_run=true"

add = {
  "add": [
    {
      "value": "#Coronaferien OR #coronaflu OR #coronaoutbreak OR #coronapandemic OR #coronapocalypse OR #Coronavirus OR Coronavirus OR #coronavirusargentina OR #coronavirusbrasil OR #CoronaVirusCanada OR #coronaviruschile OR #coronaviruscolombia OR #CoronaVirusDE OR #coronavirusecuador OR #CoronavirusEnColombia OR #coronavirusespana OR CoronavirusFR OR #CoronavirusFR OR #coronavirusIndonesia OR #Coronavirusireland OR #CoronaVirusIreland OR #coronavirusmadrid"
    }, {
      "value": "#Coronavirusmexico OR #covid2019 OR #coronavirususa OR #covid_19uk OR #covid-19uk OR #coronaapocolypse OR #coronavirusbrazil OR #coronavirusbrasil OR #coronaday OR #coronafest OR #coronavirusu OR #covid2019pt OR #COVID19PT OR #caronavirususa OR #covid19india OR #caronavirusindia OR #caronavirusoutbreak OR #caronavirus OR #2019nCoV OR 2019nCoV OR #codvid_19 OR #codvid19 OR #conronaviruspandemic OR #corona OR corona OR corona vairus OR corona virus OR #coronadeutschland"
    }, {
      "value": "#Coronavirusmexico OR #covid2019 OR #coronavirususa OR #covid_19uk OR #covid-19uk OR #Briefing_COVID19 OR #coronaapocolypse OR #coronavirusbrazil OR #marchapelocorona OR #coronavirusbrasil OR #coronafest OR #coronavirusu OR #covid2019pt OR #COVID19PT OR #caronavirususa OR #covid19india OR #caronavirusindia OR #caronavirusoutbreak OR #caronavirus OR #2019nCoV OR 2019nCoV OR #codvid_19 OR #codvid19 OR #conronaviruspandemic OR #corona OR corona OR corona vairus OR corona virus"
    }, {
      "value": "#coronavirusrd OR #coronavirustruth OR #coronavirusuk OR coronavirusupdate OR #coronavirusupdates OR #coronavirusuruguay OR coronga virus OR corongavirus OR #Corvid19virus OR #covd19 OR #covid OR covid OR #covid OR covid OR covid 19 OR #covid_19 OR #covid_19 OR Covid_19 OR #COVID_19uk OR #covid19 OR Covid19 OR Covid19_DE OR #covid19Canada OR Covid19DE OR Covid19Deutschland OR #covid19espana OR #covid19france OR #covid19Indonesia OR #covid19ireland OR #covid19uk"
    }, {
      "value": "#nCoV OR nCoV OR #ncov2019 OR nCoV2019 OR novel coronavirus OR #NovelCorona OR novelcoronavirus OR #novelcoronavirus OR #NovelCoronavirus OR #ohiocoronavirus OR #SARSCoV2 OR #SARSCoV2 OR the coronas OR #thecoronas OR Virus Corona OR #viruscorona OR #CoronaAlert OR #coronavirusUP OR #coronavirustelangana OR #coronaviruskerala OR #coronavirusmumbai OR #coronavirusdelhi OR #coronavirusmaharashtra OR #coronavirusinindia OR #covid_19ind OR #covid19india OR #coronavirusindia,"
    }, {
      "value": "#waragainstvirus OR #wearamask OR #WhenCoronaVirusIsOver OR #WhoPaysForCovid OR #WorkingFromHomeLife OR #workingfromhometips OR corono virus OR coronovirus OR Diwali In April OR essential service OR essential services OR face shield OR face shields OR Frontline OR hand sanitisers OR health worker OR health workers OR homeschooling OR hydroxychloroquine OR India for 21 OR n95 mask OR no mask OR personal protective equipment OR PPE OR remdesivir OR #trumpdemic place_country:IN"
    }
  ]
}

response = requests.post(url = url, data = json.dumps(add), headers=head)
# response = requests.get(url = "https://api.twitter.com/2/tweets/search/stream/rules", headers=head)
print(response.text)

# , {
#       "place_country": "IN"
#     }, {
#       "since": "2020-03-01"
#     }, {
#       "lang": "en"
#     }