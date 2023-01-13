exports.getData = function (username){

    let posts = [
        { id : 1 , username : username , post : `Hello how are you 1 ${username}` },
        { id : 2 , username : username , post : `Hello how are you 2 ${username}` },
        { id : 3 , username : username , post : `Hello how are you 3 ${username}` },
        { id : 4 , username : username , post : `Hello how are you 4 ${username}` },
    ];

    let usernamesArray = [
                        { username : 'muzaffar' , posts : posts },
                        { username : 'insha' , posts : posts },
                        { username : 'irtiqa' , posts : posts },
                        { username : 'rasheeqa' , posts : posts }
    ];


    var response = usernamesArray.filter(res => res.username === username );

    return response;
}
