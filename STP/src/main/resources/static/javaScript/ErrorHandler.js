export function HandleFetchError(error) {
    var errorMsg = "[ERROR] - Failed to fetch"

    if (error.status == 404) {
        console.error(errorMsg + ', page not found');
    } else if (error.status == 400) {
        console.log(error)
        error.json().then(err => {
            console.log(err)
            var msg = err.message
            if (msg == undefined) {
                console.error(err)
                alert('Bad request')
            } else {
                console.error(msg)
                alert(msg)
            }
        })
    } else {
        console.error(errorMsg);
        console.error(error)
    }
}