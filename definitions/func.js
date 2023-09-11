FUNC.refresh_tags = function() {
    DB().find('nosql/tags').callback(function(err, res) {
        MAIN.tags = res ||  [];
    })
}
FUNC.refresh_items = function() {
    DB().find('nosql/items').callback(function(err, res) {
        MAIN.items = res ||  [];
    })
}

function refresh() {
    FUNC.refresh_items();
    FUNC.refresh_tags();
}

refresh();

ON('service', function (){
    refresh();
});