let obj = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  0: "J",
};

let str = "0123456789";

const encrypt = function (id) {
  id = id.toString();
  let code = "";
  for (let i = 0; i < id.length; i++) {
    if (str.includes(id[i])) code += obj[id[i]];
    else code += id[i];
  }
  return code;
};

const encrypt2 = function (id) {
  let mapper = { A: "a", a: "A", K: "G", J: "I", b: "D", E: "e", e: "G" };
  let newId = "";
  let str = "AaKJbEe";
  for(let i=0; i<id.length; i++){
    if(str.includes(id[i])) newId += mapper[id[i]];
    else newId += id[i];
  }
  return newId;
};

const dcrypt = function(id){
    id = id.toString();
    let revObj = {};
    for(let key in obj){
        revObj[obj[key]] = key;
    }
    let code = "";
    let str = "ABCDEFGHIJ";
    for (let i = 0; i < id.length; i++) {
        if (str.includes(id[i])) code += revObj[id[i]];
        else code += id[i];
    }
    return code;
}

const saltedId = function(id, len){
    let salt = "abcdefABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let actualSalt = "";
    for(let i=0; i<6; i++){
        actualSalt += salt[Math.floor(Math.random() * salt.length)];
    }
    return id.slice(0, (len % 10) + 1) + actualSalt + id.slice((len % 10) + 1, id.length);
}

const getSecretCode = function (id, userName) {
  let encId = encrypt(id);
  let newAbs = encrypt2(encId);
  return saltedId(newAbs, userName.length);
};

module.exports = {encrypt, getSecretCode, dcrypt};
