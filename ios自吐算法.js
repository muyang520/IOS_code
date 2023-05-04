function showStacks() {
    var Exception = Java.use("java.lang.Exception");
    var ins = Exception.$new("Exception");
    var straces = ins.getStackTrace();

    if (undefined == straces || null == straces) {
        return;
    }

    console.log("============================= Stack strat=======================");
    console.log("");

    for (var i = 0; i < straces.length; i++) {
        var str = "   " + straces[i].toString();
        console.log(str);
    }

    console.log("");
    console.log("============================= Stack end=======================\r\n");
    Exception.$dispose();
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
/**
 * base64编码
 * @param {Object} str
 */
function base64Encode(str){
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
/**
 * base64解码
 * @param {Object} str
 */
function base64Decode(str){
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1) 
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1) 
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) 
                return out;
            c3 = base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1) 
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) 
                return out;
            c4 = base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1) 
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
/**
 * utf16转utf8
 * @param {Object} str
 */
function utf16to8(str){
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        }
        else 
            if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
            else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
    }
    return out;
}
/**
 * utf8转utf16
 * @param {Object} str
 */
function utf8to16(str){
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx10xx xxxx10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}

//工具相关函数 
var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    base64DecodeChars = new Array((-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 62, (-1), (-1), (-1), 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, (-1), (-1), (-1), (-1), (-1));

function stringToBase64(e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e.charCodeAt(a++), a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e.charCodeAt(a++),
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
}
function base64ToString(e) {
    var r, a, c, h, o, t, d;
    for (t = e.length, o = 0, d = ''; o < t;) {
        do
            r = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && r == -1);
        if (r == -1)
            break;
        do
            a = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && a == -1);
        if (a == -1)
            break;
        d += String.fromCharCode(r << 2 | (48 & a) >> 4);
        do {
            if (c = 255 & e.charCodeAt(o++), 61 == c)
                return d;
            c = base64DecodeChars[c]
        } while (o < t && c == -1);
        if (c == -1)
            break;
        d += String.fromCharCode((15 & a) << 4 | (60 & c) >> 2);
        do {
            if (h = 255 & e.charCodeAt(o++), 61 == h)
                return d;
            h = base64DecodeChars[h]
        } while (o < t && h == -1);
        if (h == -1)
            break;
        d += String.fromCharCode((3 & c) << 6 | h)
    }
    return d
}
function hexToBase64(str) {
    return base64Encode(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}
function base64ToHex(str) {
    for (var i = 0, bin = base64Decode(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
        var tmp = bin.charCodeAt(i).toString(16);
        if (tmp.length === 1)
            tmp = "0" + tmp;
        hex[hex.length] = tmp;
    }
    return hex.join("");
}
function hexToBytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var hexA = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}
function bytesToHex(arr) {
    var str = '';
    var k, j;
    for (var i = 0; i < arr.length; i++) {
        k = arr[i];
        j = k;
        if (k < 0) {
            j = k + 256;
        }
        if (j < 16) {
            str += "0";
        }
        str += j.toString(16);
    }
    return str;
}
function stringToHex(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
        if (val == "")
            val = str.charCodeAt(i).toString(16);
        else
            val += str.charCodeAt(i).toString(16);
    }
    return val
}
function stringToBytes(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);
        st = [];
        do {
            st.push(ch & 0xFF);
            ch = ch >> 8;
        }
        while (ch);
        re = re.concat(st.reverse());
    }
    return re;
}
//将byte[]转成String的方法
function bytesToString(arr) {
    var str = '';
    arr = new Uint8Array(arr);
    for (var i in arr) {
        str += String.fromCharCode(arr[i]);
    }
    return str;
}
function bytesToBase64(e) {
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4),
                r += '==';
            break
        }
        if (o = e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
                r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
                r += base64EncodeChars.charAt((15 & o) << 2),
                r += '=';
            break
        }
        t = e[a++],
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
            r += base64EncodeChars.charAt(63 & t)
    }
    return r
}
function base64ToBytes(e) {
    var r, a, c, h, o, t, d;
    for (t = e.length, o = 0, d = []; o < t;) {
        do
            r = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && r == -1);
        if (r == -1)
            break;
        do
            a = base64DecodeChars[255 & e.charCodeAt(o++)];
        while (o < t && a == -1);
        if (a == -1)
            break;
        d.push(r << 2 | (48 & a) >> 4);
        do {
            if (c = 255 & e.charCodeAt(o++), 61 == c)
                return d;
            c = base64DecodeChars[c]
        } while (o < t && c == -1);
        if (c == -1)
            break;
        d.push((15 & a) << 4 | (60 & c) >> 2);
        do {
            if (h = 255 & e.charCodeAt(o++), 61 == h)
                return d;
            h = base64DecodeChars[h]
        } while (o < t && h == -1);
        if (h == -1)
            break;
        d.push((3 & c) << 6 | h)
    }
    return d
}
//stringToBase64 stringToHex stringToBytes
//base64ToString base64ToHex base64ToBytes
//               hexToBase64  hexToBytes    
// bytesToBase64 bytesToHex bytesToString
function ptrtoBytearrar(addr,length){
    var ByteArray = Memory.readByteArray(addr, length);
    var uint8Array = new Uint8Array(ByteArray);
    var str = "";
    for(var i = 0; i < uint8Array.length; i++) {
        var hextemp = (uint8Array[i].toString(16))
        if(hextemp.length == 1){
            hextemp = "0" + hextemp
        }
        str += hextemp;
    }
    return str;
}

var resovler = new ApiResolver("module");
resovler.enumerateMatches('exports:libcommonCrypto.dylib!CC*',{
    onMatch:function(match){
        // console.log(JSON.stringify(match));
        console.log("已找到",match['name']+":"+match['address'])
        var methodname = match['name']+":";
        var methodaddr = match['address'];
        if(methodname.indexOf("CC_MD5:")!=-1){
            Interceptor.attach(methodaddr,{
                onEnter(args) {
                    console.log("MD5算法");
                    this.args0 = args[0]; // 入参
                    this.args2 = args[2]; // 返回值指针
                  },
                  onLeave(retval) {
                    var ByteArray = Memory.readByteArray(this.args2, 16);
                    var uint8Array = new Uint8Array(ByteArray);
                
                    var str = "";
                    for(var i = 0; i < uint8Array.length; i++) {
                        var hextemp = (uint8Array[i].toString(16))
                        if(hextemp.length == 1){
                            hextemp = "0" + hextemp
                        }
                        str += hextemp;
                    }
                    console.log(`CC_MD5(${this.args0.readUtf8String()})`);    // 入参
                    console.log(`CC_MD5 HEX()=${str}=`);             // 返回值
                    console.log(`CC_MD5 Base64()=${hexToBase64(str)}=`);             // 返回值
                    console.log("---------------------------------------------------------------");
                  }
            })
        }else if(methodname.indexOf("CC_MD5_Update:")!=-1){
            Interceptor.attach(methodaddr,{
                onEnter(args) {
                    console.log("MD5Update算法");
                    this.args1 = args[1]; // 入参
                    console.log(`MD5Update`,hexdump(this.args1));    // 入参
                    console.log("---------------------------------------------------------------");
                  },
                  onLeave(retval) {
                    // console.log(`MD5Update(${this.args1.readUtf8String()})`);    // 入参
                  }
            })

        }else if(methodname.indexOf("CC_MD5_Final:")!=-1){
            Interceptor.attach(methodaddr,{
                onEnter(args) {
                console.log("CC_MD5_Final算法");
                this.args1 = args[0]; // 入参
                  },
                  onLeave(retval) {
                    var ByteArray = Memory.readByteArray(this.args1, 16);
                    var uint8Array = new Uint8Array(ByteArray);
                
                    var str = "";
                    for(var i = 0; i < uint8Array.length; i++) {
                        var hextemp = (uint8Array[i].toString(16))
                        if(hextemp.length == 1){
                            hextemp = "0" + hextemp
                        }
                        str += hextemp;
                    }
                    console.log(`CC_MD5 HEX()=${str}=`);             // 返回值
                    console.log(`CC_MD5 Base64()=${hexToBase64(str)}=`);             // 返回值
                    console.log("---------------------------------------------------------------");
                  }
            })
        }else if(methodname.indexOf("CC_SHA256:")!=-1){
            Interceptor.attach(methodaddr,{
                onEnter(args) {
                console.log("CC_SHA256算法");
                    this.args0 = args[0]; // 入参
                    this.args2 = args[2]; // 返回值指针
                  },
                  onLeave(retval) {
                    var ByteArray = Memory.readByteArray(this.args0, 16);
                    var uint8Array = new Uint8Array(ByteArray);
                
                    var str = "";
                    for(var i = 0; i < uint8Array.length; i++) {
                        var hextemp = (uint8Array[i].toString(16))
                        if(hextemp.length == 1){
                            hextemp = "0" + hextemp
                        }
                        str += hextemp;
                    }
                    console.log(`CC_SHA256(${this.args0.readUtf8String()})`);    // 入参
                    console.log(`CC_SHA256 HEX()= ${str}`);             // 返回值
                    console.log(`CC_SHA256 Base64()= ${hexToBase64(str)}`);             // 返回值
                    console.log("---------------------------------------------------------------");
                  }
            })
        }else if(methodname.indexOf("CCHmac:")!=-1){
            var lengthdata = 0;
            var suanfaname = "";
            Interceptor.attach(methodaddr,{
                onEnter(args) {
                    
                    this.args0 = args[0].toInt32(); // 加密类型
                    this.args1 = args[1]; // KEY密钥
                    this.args2 = args[2]; // key长度
                    this.args3 = args[3]; //加密内容
                    this.args4 = args[4]; //加密内容长度
                    this.args5 = args[5]; //返回数据
                    // console.log(Memory.readUInt(this.args5))
                    
                    if(this.args0 == 0){
                        suanfaname = "CCHmacSHA1算法";
                        console.log(suanfaname);
                        lengthdata = 20;
                    }else if(this.args0 == 1){
                        console.log("CCHmacMD5算法");

                        suanfaname = "CCHmacSHA1算法";
                        console.log(suanfaname);
                        lengthdata = 16;
                    }else if(this.args0 == 2){

                        suanfaname = "CCHmacSHA256算法";
                        console.log(suanfaname);
                        lengthdata = 32
                    }else if(this.args0 == 3){
                        suanfaname = "CCHmacSHA384算法";
                        console.log(suanfaname);
                        lengthdata = 48;
                    }else if(this.args0 == 4){
                        suanfaname = "CCHmacSHA512算法";
                        console.log(suanfaname);
                        lengthdata = 64;
                    }else if(this.args0 == 5){
                        suanfaname = "CCHmacSHA224算法";
                        console.log(suanfaname);
                        lengthdata = 28;
                    }
                  },
                  onLeave(retval) {
                    var ByteArray = Memory.readByteArray(this.args5, lengthdata);
                    var uint8Array = new Uint8Array(ByteArray);
                
                    var str = "";
                    for(var i = 0; i < uint8Array.length; i++) {
                        var hextemp = (uint8Array[i].toString(16))
                        if(hextemp.length == 1){
                            hextemp = "0" + hextemp
                        }
                        str += hextemp;
                    }
                    console.log(`${suanfaname} key:(${this.args1.readUtf8String()})`);    // 入参
                    console.log(`${suanfaname} key长度:(${this.args2.toInt32()})`);    // 入参
                    console.log(`${suanfaname} 加密内容:(${this.args3.readUtf8String()})`);    // 入参
                    console.log(`${suanfaname} 加密内容长度:(${this.args4.toInt32()})`);    // 入参
                    console.log(`${suanfaname}:加密结果 HEX ()= ${str}`);             // 返回值
                    console.log(`${suanfaname}:加密结果 Base64 ()= ${hexToBase64(str)}`);             // 返回值
                    console.log("---------------------------------------------------------------");
                  }
            })
        }
        
    },onComplete:function(){
        console.log("已找完");
    }
})

//Hook加密函数AES、DES、3DES
var CCCryptaddr = Module.getExportByName(null, 'CCCrypt');
console.log(CCCryptaddr)
Interceptor.attach(CCCryptaddr,{
    onEnter:function(args){
        this.op = args[0]
        this.alg = args[1]
        this.options = args[2]
        this.key = args[3]
        this.keyLength = args[4]
        this.iv = args[5]
        this.dataIn = args[6]
        this.dataInLength = args[7]
        this.dataOut = args[8]
        this.dataOutAvailable = args[9]
        this.dataOutMoved = args[10]

 },
 onLeave: function(log, retval, state) {
    if (this.op == 0) {
        console.log("加密模式:")
        console.log("alg [0:AES128,1:DES,2:3DES]:",this.alg);
        console.log("mode [1:CBC,3:ECB|PKCS7Padding]",this.options);
        console.log("key: ",this.key.readUtf8String());
        console.log("key长度",this.keyLength.toInt32());
        console.log("iv: ",this.iv.readUtf8String());
        console.log("加密内容: ",this.dataIn.readUtf8String());
        console.log("加密内容长度: ",this.dataInLength.toInt32());
        console.log("输出内容长度: ",this.dataOutAvailable.toInt32());
        console.log("输出内容实际长度: ",this.dataOutMoved.toInt32());
        console.log("加密结果 HEX:",ptrtoBytearrar(this.dataOut,Memory.readUInt(this.dataOutMoved)))
        console.log("加密结果 Base64:",hexToBase64(ptrtoBytearrar(this.dataOut,Memory.readUInt(this.dataOutMoved))))
        console.log("---------------------------------------------------------------");
       }
       if (this.op == 1) {
         console.log("解密模式:")
         console.log("alg [0:AES128,1:DES,2:3DES]:",this.alg);
         console.log("mode[2:CBC,3:CFB]",this.options);
         console.log("key: ",this.key);
         console.log("key长度",this.keyLength.toInt32());
         console.log("iv: ",this.iv);
        console.log("解密内容 HEX: ",ptrtoBytearrar(this.dataIn,this.dataInLength.toInt32()));
        console.log("解密内容 Base64:",hexToBase64(ptrtoBytearrar(this.dataIn,this.dataInLength.toInt32())))
        console.log("解密内容 HEX: ",hexdump(this.dataIn));
        console.log("解密内容长度: ",this.dataInLength.toInt32());
         console.log("解密结果 HEX:",ptrtoBytearrar(this.dataOut,Memory.readUInt(this.dataOutMoved)))
         console.log("解密结果 Base64:",base64Decode(hexToBase64(ptrtoBytearrar(this.dataOut,Memory.readUInt(this.dataOutMoved)))) )
         console.log("---------------------------------------------------------------");
        }

    }
})

//RSA公钥加密
/*
以下是SecKeyEncrypt函数的参数解释：

key: 被用来加密数据的密钥对象，通常是由SecKeyCreateFromData函数创建并导入的一个SecKeyRef类型的对象。

padding: 加密算法的填充方式，有以下四种选择：kSecPaddingNone、kSecPaddingPKCS1、kSecPaddingOAEP、kSecPaddingPKCS1MD5、kSecPaddingPKCS1SHA1、kSecPaddingPKCS1SHA224、kSecPaddingPKCS1SHA256、kSecPaddingPKCS1SHA384、kSecPaddingPKCS1SHA512。

plainTextPtr: 需要加密的原始数据的指针地址。

plainTextLen: 需要加密的原始数据的长度。

cipherTextPtr: 存储加密后的数据的指针地址。

cipherTextLenPtr: 在输入时表示 cipherTextPtr 指向的缓冲区的大小，在输出时表示加密后的数据的实际大小。
*/
var RSASecKeyEncrypt = Module.getExportByName(null, 'SecKeyEncrypt');
Interceptor.attach(RSASecKeyEncrypt,{
    onEnter:function(args){
        this.key = args[0]
        this.padding = args[1]
        this.plainTextPtr = args[2]
        this.plainTextLen = args[3]
        this.cipherTextPtr = args[4]
        this.cipherTextLenPtr = args[5]
 },
 onLeave: function(retval) {
    console.log("[0:None,1:PKCS1,2:OAEP,0x4000 SigRaw]",this.padding.toInt32())
    console.log("RSA公钥加密内容明文:",this.plainTextPtr.readUtf8String(this.plainTextLen.toInt32()));
    console.log("RSA公钥加密内容明文长度:",this.plainTextLen.toInt32());
    // console.log(hexdump(this.cipherTextLenPtr))
    // console.log("RSA公钥加密内容密文 HEX():",ptrtoBytearrar(this.cipherTextLenPtr,Memory.readUInt(this.cipherTextLenPtr)));
    // console.log("RSA公钥加密内容密文 BASE64():",base64Encode(hexToBase64(ptrtoBytearrar(this.cipherTextLenPtr,Memory.readUInt(this.cipherTextLenPtr)))));
    // console.log("RSA公钥加密内容密文长度:",Memory.readUInt(this.cipherTextLenPtr));
    }
})


/*
SecKeyRawSign函数是用于生成数字签名的一个高级API，可以在iOS开发中使用。下面是SecKeyRawSign函数的参数解释：

    algorithm（算法）：数字签名采用的加密算法，通常为一种哈希算法，如SHA-1、SHA-256等。

    privateKey（私钥）：用于数字签名的私钥，通常是由SecKeyCreateFromData函数创建并导入的一个SecKeyRef类型的对象。

    padding（填充方式）：数字签名的填充方式，通常是PKCS1或PKCS1SHA1。

    dataToSign（待签名数据）：需要进行数字签名的原始数据。

    dataToSignLen（待签名数据长度）：待签名数据的长度。

    sig（签名数据）：返回的生成的数字签名。

    sigLen（签名数据长度）：生成的数字签名的长度。
*/
//RSA私钥加密
var RSASecKeyEncrypt = Module.getExportByName(null, 'SecKeyRawSign');
Interceptor.attach(RSASecKeyEncrypt,{
    onEnter:function(args){
        this.padding = args[2];
        this.dataToSign = args[3];
        this.dataToSignLen = args[4];
        this.sig = args[5];
        this.sigLen = args[6];
        // console.log("RSA私钥加密内容:",args[2].readUtf8String());
 },
 onLeave: function(retval) {
        console.log("私钥加密");
        console.log("待加密数据",this.dataToSign.readUtf8String())
        console.log("待加密数据长度",this.dataToSignLen.toInt32())
        console.log("签名数据",this.sig.readUtf8String())
        console.log("签名数据长度",this.sigLen.toInt32())
    }
})

//hook Base64 因为许多算法最后会用base64生成一下
var Base64addr = ObjC.classes.NSData['- base64EncodedStringWithOptions:'].implementation;
Interceptor.attach(Base64addr,{
    onEnter(args) {
      this.text = args[0];
    },
    onLeave(retval) {
      console.log(`-[NSData base64EncodedStringWithOptions:]=${ObjC.Object(retval)}=`);
    }
  })



  var base64EncodedDataWithOptionsAddr = ObjC.classes.NSData['- base64EncodedDataWithOptions:'].implementation;
  Interceptor.attach(base64EncodedDataWithOptionsAddr,{
      onEnter(args) {
        this.text = args[0];
      },
      onLeave(retval) {
        var before = ObjC.classes.NSString.alloc().initWithData_encoding_(retval, 4);
        console.log(`-[NSData base64EncodedDataWithOptions:]=${before}=`);
      }
    })
