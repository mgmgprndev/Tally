<?php
// 日本時間で時間を取得 $i は true なら時分秒も返す、これは１日一回しか修正できなくなる仕様を強引に治すため。
function timeNow($i = false) {
    $locale = 'ja_JP';
    $timeZone = new DateTimeZone('Asia/Tokyo');
    $currentDateTime = new DateTime('now', $timeZone);
    
    $formatter = new IntlDateFormatter(
        $locale,
        IntlDateFormatter::LONG,
        IntlDateFormatter::NONE,
        $timeZone,
        IntlDateFormatter::GREGORIAN,
        "yyyy/MM/dd (E)"
    );
    
    $formattedDate = $formatter->format($currentDateTime);
    
    if ($i) {
        $formattedTime = $currentDateTime->format('H:i:s');
        return $formattedDate . ' ' . $formattedTime;
    }
    return $formattedDate;
}

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (json_last_error() === JSON_ERROR_NONE) {
    $path = $_SERVER["DOCUMENT_ROOT"] . "/data.json"; 
    $json = [];
    
    if ( file_exists($path) ) {
        $json = json_decode(file_get_contents($path), true);
    }

    $time = timeNow();
    // すでに同じデーターがjsonにあるので、時分秒を使ったデーターで同日に再度何かを送れる。 (こうしないと書き換わる)
    if(isset($json[$time])) {
        $time = timeNow(true);
    }

    $json[$time] = [];

    // これは、更新のある人だけ保存する設計しそうなので、クライアントから送られた更新データーを保存するだけでOK

    foreach ($data as $userId => $userData) {

        $json[$time][$userId] = $userData; 

    }


    // 保存
    file_put_contents($path, json_encode($json));

}
?>
