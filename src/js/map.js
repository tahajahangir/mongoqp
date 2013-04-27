function() {
    if (this.query) {
        // Ignore explained queries
        if (this.query.$explain === true) {
            return;
        }
        if (this.query.query) {
            this.query = this.query.query;
        //} else if (this.query.$query)
        //    this.query = this.query.$query;
        }
    }
    if (this.op == 'command') {
        /* count/findAndModify commands looks like:
            {op: 'command',
             command: {
                 count: 'collectionname',
                 query : {...}
            }
        } */
        for (var op in {count:1, findAndModify:1}) {
            if (op in this.command) {
                this.op = op;
                this.ns = this.command[op];
                this.query = this.command;
                break;
            }
        }
    }

    // Handle old response length
    if (this.reslen) {
        this.responseLength = this.reslen;
    }

    var key = {
        op: this.op,
        ns: this.ns,
        query: this.query ? clean(this.query) : null
    };

    var value = {
        count: 1,
        millis: { min: this.millis, max: this.millis, avg: this.millis },
        nreturned: { min: this.nreturned, max: this.nreturned, avg: this.nreturned },
        nscanned: { min: this.nscanned, max: this.nscanned, avg: this.nscanned },
        responseLength: { min: this.responseLength, max: this.responseLength, avg: this.responseLength },
        ts: { min: this.ts, max: this.ts }
    };

    emit(key, value);
};
