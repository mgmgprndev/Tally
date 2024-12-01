<?php
$path = $_SERVER["DOCUMENT_ROOT"] . "/data.json"; 

$json = [];

if ( file_exists($path) ) {
    $json = json_decode(file_get_contents($path), true);
}

$users_list = [];


foreach ( $json as $date ) {
    foreach ( $date as $user => $data ) {
        if ( !isset($users_list[$user]) ) {
            $users_list[$user] = [
                "point" => $data["point"],
                "breakdown" => $data["breakdown"]
            ];
        } else {
            $users_list[$user]["point"] += $data["point"];
            $users_list[$user]["breakdown"] .= ", " . $data["breakdown"];
        }
    } 
}


// ポイントが高い順から低い順にやりたいなら、 $b-$aなんだけど、
// クライアントでの処理でprepend(上に追加)しているので、逆にソートした方がクライアント側では望んだ通り(高=>低)にできる。
uasort($users_list, function($a, $b) {
    return $a['point'] - $b['point'];
});

// ヘッダーはjsonに....
header('Content-Type: application/json; charset=utf-8');
echo json_encode($users_list); // JSONを返す

?>  