//
//  DesUtils.h
//  muyangdemo
//
//  Created by yangshuang on 2023/5/4.
//

#import <Foundation/Foundation.h>
#import "GTMBase64.h"
#import <CommonCrypto/CommonCryptor.h>
NS_ASSUME_NONNULL_BEGIN

@interface DesUtils : NSObject

//加密方法
+(NSString *) encryptUseDES:(NSString *)plainText key:(NSString *)key;
//解密方法
+(NSString *)decryptUseDES:(NSString *)cipherText key:(NSString *)key;

@end


NS_ASSUME_NONNULL_END
