$(function () {
    let myList = [];
    let myCheck = [];
    $(".input").hide();
    $(".fa-trash-alt").hide();

    $(".promt li").on("click", loadList);

    function loadList() {
        if ($(this).index() === 0) {
            if (localStorage.theList && localStorage.theList.length > 2) {
                // if yes load the list
                console.log("list  in the storage");
                let theList = JSON.parse(localStorage.theList);
                myList = theList;

                let theCheck = JSON.parse(localStorage.theCheck);
                myCheck = theCheck;
            } else {
                // if no create a default list
                alert("No list to load. Load quick list");
                console.log("list not  in the storage");
                myList = ["milk", "bread", "eggs", "vine"];
                myCheck = [0, 0, 0, 0];
            }
        } else if ($(this).index() === 1) {
            console.log("list not  in the storage");
            myList = ["milk", "bread", "eggs", "vine"];
            myCheck = [0, 0, 0, 0];
        } else {
            clearAll();
        }
        $(".input").show();
        $(".fa-trash-alt").show();
        $(".promt").hide();
        createAndReport();
        localStorage.theList = JSON.stringify(myList);
        localStorage.theCheck = JSON.stringify(myCheck);
    }

    //clear All button
    $(".fa-trash-alt").on("click", clearAll);

    function clearAll() {
        $("#list").html("");
        myList = [];
        myCheck = [];
        localStorage.theList = JSON.stringify(myList);
        localStorage.theCheck = JSON.stringify(myCheck);
    }
    // create a list
    function createAndReport() {
        let list = "";
        $.each(myList, function (index, valueOfElement) {
            //console.log(index + valueOfElement);
            if (myCheck[index] === 0) {
                list += `<li><i class="far fa-circle"></i><p>${valueOfElement}</p><i class="fas fa-times-circle"></i></li>`;
            } else {
                list += `<li><i class="far fa-check-circle"></i><p>${valueOfElement}</p><i class="fas fa-times-circle"></i></li>`;
            }
        });

        $("#list").html(list);
        $("i.far").on("click", select);
        $(".fa-times-circle").on("click", deleteLi);
    }

    $("#list").sortable({
        cursor: "grabbing",
        axis: "y",
        cancel: "i",
        stop: function () {
            // save changes on reorder
            reorderList();
        },
    });
    function reorderList() {
        let sortList = [];
        let sortCheck = [];

        $("#list li").each(function (index) {
            let listContent = $(this).contents().not($("<i>")).text();
            let itemPosition = myList.indexOf(listContent);

            sortList[index] = listContent;
            if (myCheck[itemPosition] === 0) {
                sortCheck[index] = 0;
            } else {
                sortCheck[index] = 1;
            }
        });

        myList = sortList;
        myCheck = sortCheck;

        localStorage.theList = JSON.stringify(myList);
        localStorage.theCheck = JSON.stringify(myCheck);
    }

    /* //apend to the end of the list item
    $("#list li").prepend('<i class="far fa-circle"></i>');
    $("#list li").append('<i class="fas fa-times-circle"></i>');

    // remove li from the list on click
    $("i.far").on("click", select);
    $(".fa-times-circle").on("click", deleteLi);*/

    function select() {
        let listContent = $(this).parent().contents().not($("<i>")).text();
        let itemPosition = myList.indexOf(listContent);
        if ($(this).hasClass("fa-circle")) {
            $(this).removeClass("fa-circle");
            $(this).addClass("fa-check-circle");
            // store that iteam is cheked
            myCheck[itemPosition] = 1;
        } else {
            $(this).removeClass("fa-check-circle");
            $(this).addClass("fa-circle");
            // uncheck iteam
            myCheck[itemPosition] = 0;
        }

        localStorage.theCheck = JSON.stringify(myCheck);
        console.log(myCheck);
    }
    // delite list item
    function deleteLi() {
        let listContent = $(this).parent().contents().not($("<i>")).text();
        let itemPosition = myList.indexOf(listContent);

        myList.splice(itemPosition, 1);
        myCheck.splice(itemPosition, 1);
        localStorage.theList = JSON.stringify(myList);
        localStorage.theCheck = JSON.stringify(myCheck);
        $(this)
            .parent()
            .animate(
                { opacity: 0, "margin-bottom": "-10vw" },
                500,
                function () {
                    $(this).remove();
                }
            );
    }

    // add li from input text field
    $("#addToList").on("keypress", function (e) {
        if (e.which === 13) {
            submit();
        }
    });
    $("#submit").on("click", submit);
    function submit() {
        let textValue = $("#addToList").val();
        if (textValue) {
            myList.push(textValue);
            myCheck.push(0);
            localStorage.theList = JSON.stringify(myList);
            localStorage.theCheck = JSON.stringify(myCheck);

            $("#list").append(
                `<li><i class="far fa-circle"></i><p>${textValue}</p><i class="fas fa-times-circle"></i></li>`
            );
            $("#list li:last-child .fa-times-circle").on("click", deleteLi);
            $("#list li:last-child .fa-circle").on("click", select);
            $("#list li:last-child").hide().slideDown(200);
            $("#addToList").val("");
        } else {
            alert("Can't add empty field");
        }
    }
});
