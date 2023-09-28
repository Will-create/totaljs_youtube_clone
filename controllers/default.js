var ROOMS = {};
exports.install = function() {
    ROUTE('GET /', home);
    ROUTE('GET /watch/messages/{video}/', live_messages);
    ROUTE('GET /watch/', watch);
    ROUTE('POST /chat/{video}/', chat);
    ROUTE('GET /sse/chat/{video}/', sse_chat, ['sse']);
    ROUTE('GET /admin/', admin);
}


function sse_chat(video) {
    var self = this;

    var room = ROOMS[video];

    if (room) {
        if(room.clients) {
            room.index++;
            room.clients.push(self);
        } else {
            room.index = 1;
            room.clients = [self];
        }
    } else {
        var obj = {};
        obj.index = 1;
        obj.clients = [self];
        ROOMS[video] = obj;
    }

    self.sse({ type: 'hello', data: { value: 'Hello world'}});
};

function chat(video) {
    var self = this;

    var data = self.body;


    var room = ROOMS[video];

    console.log('Message ici', data);
    data.id = UID();
    data.videoid = video;
    data.dtcreated = NOW;

    if (room.messages)
        room.messages.push(data);
    else
        room.messages = [data];

    room && room.clients.wait(function(client, next) {
        client.sse({ type: 'message', data: data });
        console.log('Message is sent');
        next();
    }, function() {
        FUNC.refresh_messages(room);
        self.success(room.index || 0);
    })

};

async function home() {

    var self = this;

    var search = self.query.search || '';
    var db = DB();
    var builder = db.find('nosql/items');
    search && builder.search('search', search);
    var items = await builder.promise();

    var tags = await db.find('nosql/tags').promise();

    self.view('index', {items, tags, slug: self.query.tag ? self.query.tag.slug() : 'live' });
};


async function watch() {
    var self = this;
    var video = self.query.v;
    var db = DB();
    var description = `
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi cum modi consequuntur maiores, quidem non eos eveniet nihil illo, sunt nam voluptates exercitationem! Reiciendis pariatur vitae asperiores at sequi fugit!
    `;


    if (!video) 
        self.redirect('/');

    var item = await db.read('nosql/items').where('id', video).promise();
    var tags = await db.find('nosql/tags').promise();
    var messages = await db.find('nosql/messages').where('videoid', video).promise();


    console.log(item, 'video id: ', video);

    if (item)
        self.view('video', { item, messages: messages || [], description, tags, slug: self.query.tag ? self.query.tag.slug() : 'live'});
    else
        self.view('404', { tags, slug: self.query.tag ? self.query.tag.slug() : 'live' });
}



async function live_messages(video) {
    var self = this;
    var db = DB();
    var messages = await db.find('nosql/messages').where('videoid', video).promise();
    self.json(messages);
}

function admin() {
    var self = this;
    self.view('admin', {items: []});
}