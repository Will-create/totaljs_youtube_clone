exports.install = function() {
    ROUTE('GET /', home);
}

function home() {

    var self = this;

    var items = MAIN.items || [];
    var tags = MAIN.tags || [];

    self.view('index', {items, tags, slug: self.query.tag ? self.query.tag.slug() : 'live' });
}