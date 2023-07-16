//
//  Utils.h
//  muyangdemo
//
//  Created by yangshuang on 2023/4/15.
//

#import <Foundation/Foundation.h>
#import "People.h"
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonCryptor.h>

#import <CommonCrypto/CommonHMAC.h>
#import "DesUtils.h"

#define Ivv @"0000000000000000" //偏移量,可自行修改


NS_ASSUME_NONNULL_BEGIN

@interface Utils : NSObject

-(int)add:(int)num1 andnum2:(int)num2;

-(int)test:(int)num1;

+(NSString*)pinjie:(NSString*)str1 andstr2:(NSString*)str2;

+(void) tesuleixing:(People*)people andNSArray:arg_ns andNSDictionary:arg_dt;

+(void) block_method:(int) num1 to:(int)num2 completion:(void (^)(int result))completionblock;

+(NSString*)jiami_md5:(NSString*)str;

+(NSString*)jiami_SHA256:(NSString*)str;

+(NSString *)jiami_HMAC256:(NSString*)str;
/**
 *  加密方法
 *
 *  @param str   需要加密的字符串
 *  @param path  '.der'格式的公钥文件路径
 */
+ (NSString *)encryptString:(NSString *)str publicKeyWithContentsOfFile:(NSString *)path;

/**
 *  解密方法
 *
 *  @param str       需要解密的字符串
 *  @param path      '.p12'格式的私钥文件路径
 *  @param password  私钥文件密码
 */
+ (NSString *)decryptString:(NSString *)str privateKeyWithContentsOfFile:(NSString *)path password:(NSString *)password;

/**
 *  加密方法
 *
 *  @param str    需要加密的字符串
 *  @param pubKey 公钥字符串
 */
+ (NSString *)encryptString:(NSString *)str publicKey:(NSString *)pubKey;

/**
 *  解密方法
 *
 *  @param str     需要解密的字符串
 *  @param privKey 私钥字符串
 */
+ (NSString *)decryptString:(NSString *)str privateKey:(NSString *)privKey;



/**
 加密算法

 @param content 待加密字符串
 @param key 密钥
 @return 加密后字符串
 */
+ (NSString *)AESencryptAES:(NSString *)content key:(NSString *)key;

/**
 解密算法

 @param content 待解密字符串
 @param key 密钥
 @return 解密后字典
 */
+ (NSString *)AESdecryptAES:(NSString *)content key:(NSString *)key;




@end

NS_ASSUME_NONNULL_END
