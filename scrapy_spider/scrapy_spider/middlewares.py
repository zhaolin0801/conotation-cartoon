from selenium import webdriver
from scrapy.http import HtmlResponse
import time
class JavaScriptMiddleware(object):
    def process_request(self, request, spider):
        if spider.name == "comic":
            print "PhantomJS is starting..."
            driver = webdriver.PhantomJS()
            # driver = webdriver.Firefox()
            driver.get(request.url)
            time.sleep(1)
            #js = "var q=document.documentElement.scrollTop=10000"
            #driver.execute_script(js)
            #time.sleep(3)
            body = driver.page_source
            print ("----------------------request------------------: "+request.url)
            return HtmlResponse(driver.current_url, body=body, encoding='utf-8', request=request)
        else:
            return