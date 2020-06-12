function main() {
    /* 使いやすい用にスプレッドシートの値を取得するようにしている */
    const SS = SpreadsheetApp.openById("シートID");
    const SH = SS.getSheetByName("シート名");
    const DETA = SH.getDataRange().getDisplayValues();

    const background = DETA[1][1];/* 背景画像のURL */
    const imageTitle = DETA[2][1];/* タイトル画像 */
    const imageSubTitle = DETA[3][1];/* サブタイトル画像 */
    const fileName = DETA[4][1];/* Wordpressに保存するファイル名 */
    const x1 = DETA[5][1];/*タイトル画像のX座標 */
    const y1 = DETA[6][1];/* タイトル画像のY座標 */
    const x2 = DETA[7][1];/* サブタイトル画像のX座標 */
    const y2 = DETA[8][1];/* サブタイトル画像のY座標 */
    const altText = DETA[9][1];/* Wordpressに設定する画像のaltText */
    const title = DETA[10][1];/* Wordpressに設定する画像のタイトル */
    const caption = DETA[11][1];/* Wordpressに設定する画像のcaption */
    const description = DETA[12][1];/* Wordpressに設定する画像の説明 */

    /* http://placehold.jp/　という画像生成サイトを利用して、文字入り画像を生成している。(CSSでちょっとリッチに生成している) */
    const titleIamge = "http://placehold.jp/70/00336d/ffffff/1200x250.png?text=" + encodeURIComponent(imageTitle) + "&css=%7B%22background-color%22%3A%22%20rgba(0%2C51%2C109%2C0.9)%22%7D";
    const subTitleImage = "http://placehold.jp/30/eaeae0/00336d/500x130.png?text=" + encodeURIComponent(imageSubTitle);

    const parameters = {
        addImageURLs: [background, titleIamge, subTitleImage],
        addImagePoints: [[x1, y1], [x2, y2]]
    };

    /* 別スクリプトで公開したURLを指定する */
    const url = "GASの公開URL" + encodeURIComponent(JSON.stringify(parameters));

    /* phantomjscloudでキャプチャする位置を指定する */
    const GSoption = {
        url: url,
        renderType: "png",
        renderSettings: {
            viewport: {
                width: 1200,
                height: 630
            },
            clipRectangle: {
                top: 59,
                width: 1200,
                height: 630
            }
        }
    };
    const payload = encodeURIComponent(JSON.stringify(GSoption));
    /* キャプチャ画像を取得する */
    const image = UrlFetchApp.fetch("https://phantomjscloud.com/api/browser/v2/" + "phantomjscloudのキー" + "/?request=" + payload).getBlob();

    /* WordPressにアップロードするためのヘッダー */
    const headers = {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment;filename=" + fileName + ".png",
        "accept": "application/json",
        "Authorization": "Basic " + Utilities.base64Encode("Wordpressのユーザー名" +: +"Wordpressのパスワード")
    };

    const wpOptions = {
        "method": "POST",
        "headers": headers,
        "payload": image,
    };

    /* WordPressにアップロードする */
    UrlFetchApp.fetch(`WordpressのURL/wp-json/wp/v2/media?alt_text=${altText}&title=${title}&caption=${caption}&description=${description}`, wpOptions);
}
