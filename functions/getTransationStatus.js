async function getTransactionStatus(response){    
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
     return fetch(`${response.pollUrl}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            const resbody = `${result}`
            const start = resbody.indexOf('status=') + 'status='.length;
            const end = resbody.indexOf('&', start);
            const status = resbody.substring(start, end);
            return status;
        })
        .catch(error => console.log('error', error));

}

module.exports ={
    getTransactionStatus
}