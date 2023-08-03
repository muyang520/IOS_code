//
//  JailbreakViewController.h
//  muyangdemo
//
//  Created by yangshuang on 2023/7/31.
//

#import "ViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface JailbreakViewController : ViewController

- (BOOL)checkPluginAppIsInstalled:(NSString *)plugin_app;
@end

NS_ASSUME_NONNULL_END
