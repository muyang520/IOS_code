//
//  AgentDetection.h
//  muyangdemo
//
//  Created by yangshuang on 2023/7/17.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface AgentDetection : NSObject

- (NSArray *)checkAgentAppIsInstalled;
- (BOOL)checkProxyStatusByCFNetworkCopySystemProxySettings;
- (NSDictionary *)getCFNetworkCopySystemProxySettingsDetails;
- (NSString *)setConnectionProxyDictionary;

@end

NS_ASSUME_NONNULL_END
