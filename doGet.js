function doGet(e) {
    const parameter = JSON.stringify(e.parameter);
    /* JSONのパラメータ文字列をJSONに変換する */
    const requestJson = JSON.parse(parameter.replace('{"', '').replace('":""}', '').replace(/\\/g, ''));

    let html = HtmlService.createTemplateFromFile("index");
    html.addImageURLsBase64 = blobToBase64(requestJson["addImageURLs"]);
    html.addImagePoints = requestJson["addImagePoints"];

    return html.evaluate().setTitle("サムネイル画像自動生成");
}

/* 画像URLの配列をBase６４形式のデータに変換する */
/* Canvasでは外部URLの画像が使えないためBase６４形式で受け渡す必要がある */
function blobToBase64(imageURLs) {
    let addImageURLsBase64 = [];

    const options = {
        "muteHttpExceptions": true,/* 404エラーでも処理を継続する */
    }

    for (let i in imageURLs) {
        let response = UrlFetchApp.fetch(imageURLs[i], options);
        let blob = response.getBlob();
        let content_type = blob.getContentType();
        let base64 = Utilities.base64Encode(blob.getBytes());
        Utilities.sleep(1 * 500);
        addImageURLsBase64.push(base64);
    }

    return addImageURLsBase64;
}