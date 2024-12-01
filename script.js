// ユーザーの新規作成ファンクション
function createUserIfNotExist() {

    // インプットの取得
    const user = document.getElementById("userid");
    const point = document.getElementById("point");
    const breakdown = document.getElementById("breakdown");

    // ユーザ存在の有無確認
    if ( document.getElementById(user.value) != null ) {
        return false;
    } 

    // 追加
    createUserElement(user.value, point.value, breakdown.value, true);

    // フォームリセット
    user.value = "";
    point.value = "";
    breakdown.value = "ユーザ追加";

    return true;
}

// ユーザーエレメント作成
function createUserElement(user, point, breakdown, i) {
    const trElement = document.createElement("tr");
    trElement.id = user; 
    trElement.classList = "bg-white border-b dark:bg-gray-800 dark:border-gray-700 user-data"; // user-data クラスを後々のために入れておく。
    trElement.setAttribute("userId",user); // このエレメントが誰を指すのかを示す。
    
    const thUser = document.createElement("th");
    thUser.innerHTML = user;
    thUser.scope = "row";
    thUser.classList = "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white";
    
    const tdPoint = document.createElement("td");
    tdPoint.innerHTML = point + "ポイント";
    tdPoint.classList = "px-6 py-4";
    
    const tdBreakdown = document.createElement("td");
    tdBreakdown.innerHTML = breakdown;
    tdBreakdown.classList = "px-6 py-4";
    
    const tdControl = document.createElement("td");
    tdControl.classList = "px-6 py-4 gap-5 flex flex-row";

    const inputPoint = document.createElement("input");
    inputPoint.placeholder = "ポイント";
    inputPoint.type = "number";
    inputPoint.name = user + "_point"
    inputPoint.classList = "w-auto bg-transparent outline-none border border-gray-950 px-2 py-2 rounded-md point-input";

    const inputBreakdown = document.createElement("input");
    inputBreakdown.placeholder = "内訳";
    inputBreakdown.type = "text";
    inputPoint.name = user + "_point"
    inputBreakdown.classList = "w-auto bg-transparent outline-none border border-gray-950 px-2 py-2 rounded-md breakdown-input";

    if ( i ) {
        inputPoint.value = point;
        inputBreakdown.value = breakdown;
    }

    tdControl.append(inputPoint);
    tdControl.append(inputBreakdown);

    trElement.appendChild(thUser);
    trElement.appendChild(tdPoint);
    trElement.appendChild(tdBreakdown);
    trElement.appendChild(tdControl);

    document.getElementById("datas").prepend(trElement);   
}

// データーをサーバーに送信
function sendData() {
    var dataToSend = {}; 
    // 全ての user-data クラスを持つエレメントを取得。
    var userDataElements = document.querySelectorAll(".user-data");
    userDataElements.forEach((el) => {
        var userId = el.getAttribute("userId"); // このエレメントが誰のものか取得
        // その子エレメントのインプットを取得。
        var pInput = el.querySelector(".point-input").value;
        var bInput = el.querySelector(".breakdown-input").value;

        if ( userId != null && userId != "" && pInput != "" && bInput != "" ) {
            dataToSend[userId] = {
                point: pInput,
                breakdown: bInput
            };
        }
    });


    // サーバーに送信
    fetch('/apply.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.text())
    .then(responseData => console.log(responseData));

    // リロード
    window.location.reload();
}


// APIから最新データーのフェッチ。リロードのたびに呼ばれる (index.htmlの最後の方参照)
function fetchForData() {
    fetch("/api.php")
    .then((response) => response.json())
    .then((json) => {
        // jsonのキーとバリューを分けてる。
        Object.entries(json).forEach(([key, val]) => {
            createUserElement(key, val["point"], val["breakdown"], false);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}