var scripts = {
    "aliases" : {
        "react/lib": "/node_modules/react/lib",
        "react": "/node_modules/react/dist/react.min.js",
        "react-dom": "/node_modules/react-dom/dist/react-dom.min.js",
        "react-bootstrap": "/node_modules/react-bootstrap/dist/react-bootstrap.min.js",
        "react-router": "/node_modules/react-router/umd/ReactRouter.min.js",
        "history/lib": "/node_modules/history/umd/History.min.js",        

    },
    "chunks": {
        "vendor": [
            'react',
            'react-dom',
            'react-bootstrap',
           
        ] 

    },
    noParse: [
        "jquery",
        "moment",
        "summernote",
        "to-markdown",
        "raphael",
        "morris",
        "dygraphs",
        "chartjs",
        "ckeditor"
    ]
};

module.exports = scripts;


