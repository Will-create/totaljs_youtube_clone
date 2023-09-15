FUNC.patch = async function() {
    var db = DB();

    var items = await db.find('nosql/items').promise();

    for (m of items) {
        var id = UID();
        m.id = id;
        await db.insert('nosql/items2', m).promise();
    }
}





//FUNC.patch()

FUNC.refresh_messages = function (room) {
    var db = DB();
    room.messages.wait(async function(m, next) {
        var msg = await db.read('nosql/messages').where('id', m.id).promise();
        if (!msg)
            await db.insert('nosql/messages', m).promise();

        next();
    }, function() {
        console.log('DONE');
    })
}