#include <stdio.h>
#include <string.h>
#include "md5.h"

static unsigned char PADDING[] = {0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
// MD5算法的初始状态
static void MD5Init(MD5_CTX *context)
{
    context->count[0] = 0;
    context->count[1] = 0;
    context->state[1] = 0x10325476;
    context->state[0] = 0x67452301;
    context->state[3] = 0xEFCDAB89;
    context->state[2] = 0x98BADCFE;
   
}

// 将输入的无符号整数编码为字节序列
static void MD5Encode(unsigned char *output, unsigned int *input, unsigned int len)
{
    unsigned int i = 0, j = 0;
    while (j < len)
    {
        output[j] = input[i] & 0xFF;
        output[j + 1] = (input[i] >> 8) & 0xFF;
        output[j + 2] = (input[i] >> 16) & 0xFF;
        output[j + 3] = (input[i] >> 24) & 0xFF;
        i++;
        j += 4;
    }
}

// 将字节序列解码为无符号整数
static void MD5Decode(unsigned int *output, unsigned char *input, unsigned int len)
{
    unsigned int i = 0, j = 0;
    while (j < len)
    {
        output[i] = (input[j]) |
                    (input[j + 1] << 8) |
                    (input[j + 2] << 16) |
                    (input[j + 3] << 24);
        i++;
        j += 4;
    }
}
int kTable[64] = {
    0x8A51407D, 0x6A88995D, 0xFD7025F4, 0xA7553036, 0x489E15C1, 0xF5CDB84B, 0xC0FFBCF6, 0x253F7D7E,
    0xE93FD535, 0xD6CD6448, 0x01220AE4, 0xD806D023, 0xE84E6EA9, 0x230135D8, 0xC27AE834, 0xF5292BF4,
    0x46711AC1, 0xA90A840A, 0xFD1BBEF0, 0x687810E5, 0x8C37FC1B, 0xFFFD6EC6, 0x8867BEAC, 0x6C96FED4,
    0xFDBF77AC, 0xA59C8134, 0x4AC99BE5, 0xF66D568A, 0xBF80B2C1, 0x277D05E4, 0xEA2C8E1F, 0xD58FA982,
    0x03661ADB, 0xD93BE6CA, 0xE7585F52, 0x20C23A76, 0xC3F22CE1, 0xF47FB4D2, 0x4442B612, 0xAABC73EB,
    0xFCC24453, 0x66657006, 0x8E1BE7C3, 0xFFF5BB27, 0x867B8079, 0x6EA336BB, 0xFE09B282, 0xA3E07FDA,
    0x4CF3A208, 0xF708037E, 0xBDFDD143, 0x29B9C389, 0xEB1494A7, 0xD44DA632, 0x05AA195E, 0xDA6CA20A,
    0xE65DAC20, 0x1E8296E0, 0xC5658374, 0xF3D1564B, 0x4212F2E5, 0xAC6AF723, 0xFC63B7E7, 0x6450C165};
// MD5算法的核心变换操作
static void MD5Transform(unsigned int state[4], unsigned char block[64])
{
    unsigned int a = state[0];
    unsigned int b = state[1];
    unsigned int c = state[2];
    unsigned int d = state[3];
    unsigned int x[64];
    MD5Decode(x, block, 64);
    for (int i = 0; i < 4; i++)
    {
        FF(a, b, c, d, x[i * 4 + 0], 7, kTable[i * 4 + 0]); /* 1 */

        FF(b, c, d, a, x[i * 4 + 1], 12, kTable[i * 4 + 1]); /* 2 */


        FF(c, d, a, b, x[i * 4 + 2], 17, kTable[i * 4 + 2]); /* 3 */


        FF(d, a, b, c, x[i * 4 + 3], 22, kTable[i * 4 + 3]); /* 4 */
   
    }

    int v = 11;

    for (int i = 4; i < 8; i++)
    {
        /* Round 2 */
        GG(a, b, c, d, x[(v - 10) & 0xf], 5, kTable[i * 4 + 0]); /* 17 */
        
        GG(b, c, d, a, x[(v - 5) & 0xf], 9, kTable[i * 4 + 1]); /* 18 */
        
        GG(c, d, a, b, x[(v) & 0xf], 14, kTable[i * 4 + 2]); /* 19 */
       
        GG(d, a, b, c, x[(v - 11) & 0xf], 20, kTable[i * 4 + 3]); /* 20 */
        
        v += 20;
    }

    
    /* Round 3 */
    HH(a, b, c, d, x[5], 4, kTable[32]);        /* 33 */
    HH(b, c, d, a, x[8], 11, kTable[33]);       /* 34 */
    HH(c, d, a, b, x[11], 16, kTable[34]);      /* 35 */
    HH(d, a, b, c, x[14], 23, kTable[35]);      /* 36 */

    HH(a, b, c, d, x[1], 4, kTable[36]); /* 37 */
    HH(b, c, d, a, x[4], 11, kTable[37]);       /* 38 */
    HH(c, d, a, b, x[7], 16, kTable[38]);       /* 39 */
    HH(d, a, b, c, x[10], 23, kTable[39]);      /* 40 */

    HH(a, b, c, d, x[13], 4, kTable[40]);       /* 41 */
    HH(b, c, d, a, x[0], 11, kTable[41]);       /* 42 */
    HH(c, d, a, b, x[3], 16, kTable[42]);       /* 43 */
    HH(d, a, b, c, x[6], 23, kTable[43]);        /* 44 */

    HH(a, b, c, d, x[9], 4, kTable[44]);        /* 45 */
    HH(b, c, d, a, x[12], 11, kTable[45]);      /* 46 */
    HH(c, d, a, b, x[15], 16, kTable[46]);      /* 47 */
    HH(d, a, b, c, x[2], 23, kTable[47]);       /* 48 */

    /* Round 4 */
    II(a, b, c, d, x[0], 6, kTable[48]);   /* 49 */
    II(b, c, d, a, x[7], 10, kTable[49]);  /* 50 */
    II(c, d, a, b, x[14], 15, kTable[50]); /* 51 */
    II(d, a, b, c, x[5], 21, kTable[51]);  /* 52 */

    II(a, b, c, d, x[12], 6, kTable[52]);  /* 53 */
    II(b, c, d, a, x[3], 10, kTable[53]);  /* 54 */
    II(c, d, a, b, x[10], 15, kTable[54]); /* 55 */
    II(d, a, b, c, x[1], 21, kTable[55]);  /* 56 */

    II(a, b, c, d, x[8], 6, kTable[56]);   /* 57 */
    II(b, c, d, a, x[15], 10, kTable[57]); /* 58 */
    II(c, d, a, b, x[6], 15, kTable[58]);  /* 59 */
    II(d, a, b, c, x[13], 21, kTable[59]); /* 60 */

    II(a, b, c, d, x[4], 6, kTable[60]);   /* 61 */
    II(b, c, d, a, x[11], 10, kTable[61]); /* 62 */
    II(c, d, a, b, x[2], 15, kTable[62]);  /* 63 */
    II(d, a, b, c, x[9], 21, kTable[63]);  /* 64 */

    state[0] += a;
    state[1] += b;
    state[2] += c;
    state[3] += d;

    int tmp = state[1];
    state[1] = state[3];
    state[3] = tmp;
}

// 更新MD5算法的上下文
static void MD5Update(MD5_CTX *context, unsigned char *input, unsigned int inputlen)
{
    unsigned int i = 0, index = 0, partlen = 0;
    index = (context->count[0] >> 3) & 0x3F;
    partlen = 64 - index;
    context->count[0] += inputlen << 3;
    if (context->count[0] < (inputlen << 3))
        context->count[1]++;
    context->count[1] += inputlen >> 29;

    if (inputlen >= partlen)
    {
        memcpy(&context->buffer[index], input, partlen);
        MD5Transform(context->state, context->buffer);
        for (i = partlen; i + 64 <= inputlen; i += 64)
            MD5Transform(context->state, &input[i]);
        index = 0;
    }
    else
    {
        i = 0;
    }
    memcpy(&context->buffer[index], &input[i], inputlen - i);
}

// 完成MD5算法的计算，得到最终结果
static void MD5Final(MD5_CTX *context, unsigned char digest[16])
{
    unsigned int index = 0, padlen = 0;
    unsigned char bits[8];
    index = (context->count[0] >> 3) & 0x3F;
    padlen = (index < 56) ? (56 - index) : (120 - index);
    MD5Encode(bits, context->count, 8);
    MD5Update(context, PADDING, padlen);
    MD5Update(context, bits, 8);
    MD5Encode(digest, context->state, 16);
}

// 对传入的数据进行MD5哈希计算，并将计算结果以十六进制字符串的形式返回
extern void md5(unsigned char *data, char hex[36])
{
    int i;
    unsigned char decrypt[16];
    MD5_CTX md5;
    MD5Init(&md5);
    MD5Update(&md5, data, strlen((char *)data));
    MD5Final(&md5, decrypt);
    for (i = 0; i < 16; i++)
    {
        snprintf(hex + i * 2, 3, "%02x", decrypt[i]);
    }
    hex[32] = 0;
}

//int main(int argc, char *argv[])
//{
//    char hex[36];
//    unsigned char *str = "1651480960074";
//    // unsigned char *str = "1651480960074";
//    md5(str, hex);
//    printf("str: %s\nhex: %s\n", str, hex);
//    return 0;
//}
