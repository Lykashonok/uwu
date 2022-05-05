export function parseQuery(query : string) {
    let variables = query.substring(1).split('&');
    let result : {
        [key : string] : string
    } = {};
    variables.forEach(element => {
        let pair = element.split('=');
        if (pair.length > 0) {
            result[pair[0]] = pair[1];
        }
    });
    return result;
}