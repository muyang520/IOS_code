//
//  ViewController.m
//  muyangdemo
//
//  Created by yangshuang on 2023/4/15.
//

#import "ViewController.h"
#import "Utils.h"
#include "../C_suanfacode/md5.h"

@interface ViewController ()

@end

@implementation ViewController



-(void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    
    UIButton *loginButton = [UIButton buttonWithType:UIButtonTypeCustom];
    loginButton.frame = CGRectMake(45, 480, 80, 40);
    loginButton.backgroundColor = [UIColor greenColor];
    [loginButton setTitle:@"网络请求" forState:UIControlStateNormal];
    [loginButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [loginButton addTarget:self action:@selector(sendUrl:) forControlEvents:UIControlEventTouchUpInside];
    
    [self.view addSubview:loginButton];
}


- (IBAction)button_putongMethod {
    Utils* utils = [[Utils alloc]init];
    int result =[utils add:1 andnum2:2];
    NSLog(@"%d",result);
    result =[utils test:1];
    NSLog(@"%d",result);
}

- (IBAction)switch_bgcolor {
    if(self.view.backgroundColor == [UIColor greenColor]){
        self.view.backgroundColor = [UIColor blackColor];
    }else{
        self.view.backgroundColor = [UIColor greenColor];
    }
}

- (IBAction)button_jingtaimethod {
    NSLog(@"%@",[Utils pinjie:@"nihao" andstr2:@"shijie"]);
}

- (void)sendUrl:(UIButton *)sender {
    
    NSString *searchKeyword = @"沐阳Ays971124";
    //encode编码
    NSString *encodedKeyword = [searchKeyword stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
    NSString *searchURLString = [NSString stringWithFormat:@"https://www.baidu.com/s?wd=%@", encodedKeyword];
    //转换成URL对象
    NSURL *url = [NSURL URLWithString:searchURLString];
    
    
    NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
    //设置请求头
    [config setHTTPAdditionalHeaders:@{@"User-Agent":@"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}];
    
    //创建请求任务
    NSURLSessionDataTask *task = [[NSURLSession sessionWithConfiguration:config] dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        //请求结果回调
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        NSString *result = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSLog(@"Result: %@", result);
    }];
    //发送请求
    [task resume];
}

- (IBAction)button_teshucanshu:(id)sender {
    People *people = [[People alloc]init];
    people.name = @"张三";
    people.age = 10;
    people.sex = @"男";
    
    NSArray *iosArray = @[@"L", @"O", @"V", @"E", @"I", @"O", @"S"];
    
    NSDictionary *dict = @{@"1":@"11", @"2":@"22", @"3":@"33"};
    
    [Utils tesuleixing:people andNSArray:iosArray andNSDictionary:dict];
}

int sum(int value1,int value2){
    return value1+value2;
}
//指针类型
typedef int(*calculte)(int,int);

//block类型
typedef int (^calculteBlock)(int,int);


- (IBAction)button_Block:(id)sender {
    calculte sumP = sum;
    NSLog(@"sum = %i",sumP(1,2));
    
    int (^sumBlock)(int,int);
    sumBlock = ^(int value1,int value2){
        return value1 + value2;
    };
    NSLog(@"sumBlock = %i",sumBlock(1,2));
    
    calculteBlock sumBlock2 = ^(int value1,int value2){
        return value1 + value2;
    };
    NSLog(@"sumBlock2 = %i",sumBlock2(1,2));
    
    [Utils block_method:10 to:20 completion:^(int result){
        NSLog(@"主动调用block函数值=%i",result);
    }];
}

- (IBAction)button_ccmd5:(id)sender {
    NSString *result = [Utils jiami_md5:@"muyang"];
    NSLog(@"MD5 value: %@", result);
    
    char hex[36];
    unsigned char *str = "1651480960074";
    // unsigned char *str = "1651480960074";
    md5(str, hex);
    NSLog(@"str: %s\nhex: %s\n", str, hex);
    
}

- (IBAction)button_SHA256:(id)sender {
    NSString *result = [Utils jiami_SHA256:@"muyang"];
    NSLog(@"SHA256 value: %@", result);
    
}

- (IBAction)button_HMAC256:(id)sender {
    NSString *result = [Utils jiami_HMAC256:@"muyang"];
    NSLog(@"SHA256 value: %@", result);
}


- (IBAction)button_RSA:(id)sender {
    //http://web.chacuo.net/netrsakeypair
    
    NSString *originalString = @"muyang666";
    
    //使用字符串格式的公钥私钥加密解密
    NSString *encryptStr = [Utils encryptString:originalString publicKey:@"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA36dIZzm4fTfSk+RGAXbw6TW/DVN3LHUUuCSxUA3zsJRwBxTXqhKD0o1xu8SJyN6sOg447wEMQ5YtFsr+m+StNRNQKO92JoEL4OCEa1u5aUg6QLeIHP8zALXvsa1XxiWdfHnJuFQFno0AmGr6mzQMTjalidU+hhMCDOGyTtiLgU7/jJv1XnIRQdTEz5mHiPSvqNCCR7OFDWowYOrmEwID0vDT17AM3hPj7zMU96TMR6kctoj3twJIp8fZle99Z+LLfQd5P8pQHzxFpRlgqHpNLsaEyJGHr8lTr9C6Zwci1V+vedVo575AQ+i3h1dEY66Id5q0Pe4nwnLKnToPRzddywIDAQAB"];
    
    NSLog(@"RSA加密前:%@", originalString);
    NSLog(@"RSA加密后:%@", encryptStr);
    NSLog(@"RSA解密后:%@", [Utils decryptString:encryptStr privateKey:@"MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDfp0hnObh9N9KT5EYBdvDpNb8NU3csdRS4JLFQDfOwlHAHFNeqEoPSjXG7xInI3qw6DjjvAQxDli0Wyv6b5K01E1Ao73YmgQvg4IRrW7lpSDpAt4gc/zMAte+xrVfGJZ18ecm4VAWejQCYavqbNAxONqWJ1T6GEwIM4bJO2IuBTv+Mm/VechFB1MTPmYeI9K+o0IJHs4UNajBg6uYTAgPS8NPXsAzeE+PvMxT3pMxHqRy2iPe3Akinx9mV731n4st9B3k/ylAfPEWlGWCoek0uxoTIkYevyVOv0LpnByLVX6951WjnvkBD6LeHV0Rjroh3mrQ97ifCcsqdOg9HN13LAgMBAAECggEAVdkcTaM2UbpPtjz1MjK5norm3vKe2A3I+jX7acMxOyJ/LfiuH7Yjq3pnoa97RANVEKPM7tD0KC1I+WrJ+IT6h1j2eAAS1gzKxnLn4V2/+c2jrpvEP30l0qwDaawj+QcPQGxvJbX6wjVVeSv3LgP4hT0spY+ZBFXff5pSmzk7s1IrpU8XGJtJzbCsDInvKfn+Zn5RAYHzSWLIJKmQvcevbN+4qYWuTPgR00V0YQI+5UOM26v03OYaxMUQmqVg26ZRXhwLM2MQvjXhkgL+FcJevP8KyC69RwfwSAyh0e5IePfi9eBcWjIa8szbPgfKdoXtIXqsTOPLoJoBBDwYp+93wQKBgQD5GyNC9+VlF7bpIoprg2O0sbDv27U1ZFwsiITwV2s8NQ34lA8SCz2xme/uT5YXDWnvzYTQ5AEnsWBjous1z0NmdqY2gKuMO92U0sRwpao7KHr6SCfGXcSw8JXmR9uYRLb+TZWxZqG7oKuG1tCts82ACxMoI47mJtnIeiBWwxi6+QKBgQDl19G3fe5iEdSmqhumYeAwu6UC5PEIbn+cIdCDjyI56dorpVcPOyRdSNqz9m40hSlgSgKj3UXYB2FXQok7Ae/7beGDEV0qiSOBpPrF1PkjP+qpuyLpcEASz4spyCO98ZOGk5FPRV7l4APa+VvNNaKNf3WzL2qGzc/x6dDZFJ/r4wKBgQCYuGWG4ho2PzK5fZ6lSXkwR5w1gVp4MF4+QzhVbRLmZ5R4KLWQl2msX7b0QMDAw02GYlaiBpcasalpjHFtnPMyd11xnrMNl4pCenFKqpZSDIBQvzn7aHN1ExqjgryDfuU9xW0XxNc1A80FLt/jDo/Xh3KoMhyix4DPYug+qP+ZaQKBgFUYeoS9Ey0r/NdX07TeN+rTDlzr9nFwt75OpqyOqdVXR3cxV/JDq0r+Vjqa2mKHirIjtKaGnf1FfjyYXcaDCR7Fp+Cm5R+CdqrhMhdcqoDqgS8mId7buF0+if+GIfWJI12H9RysSl5BeivwdpSbbvuEXUdiHsaaHIssTi6Q/ESRAoGBANKoidZzITHf3TkaOLP6NORRwPKgojEA167GAyl3DNf7RdGf0lTZbxhJCYV3UFGf17PFJExSwoVPQ6hFtjO4GVOoId7dmlpm5OFXJ1Gkp0gkJXh0DhgcwYNc9HHy5oGh0tFAgSnd0M2kaakxCVIMVS9LhRr8qCDCui0cPDkR/YbJ"]);
}

- (IBAction)button_AES:(id)sender {
    NSString *content = @"muyang";
    NSString *key = @"0123456789123456";
    NSString* jiamiresult = [Utils AESencryptAES:content key:key];
    NSString* jiemires = [Utils AESdecryptAES:jiamiresult key:key];
    NSLog(@"AES加密前原文=%@",content);
    NSLog(@"AES加密后=%@",jiamiresult);
    NSLog(@"AES解密后=%@",jiemires);
    
}

- (IBAction)button_DES:(id)sender {
    NSString *content = @"muyang";
    NSString *key = @"Ays971124";
    NSString* jiamiresult = [DesUtils encryptUseDES:content key:key];
    NSString* jiemires = [DesUtils decryptUseDES:jiamiresult key:key];
    NSLog(@"DES加密前原文=%@",content);
    NSLog(@"DES加密后=%@",jiamiresult);
    NSLog(@"DES解密后=%@",jiemires);
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentDirectory = [paths objectAtIndex:0];
    NSLog(@"documentDirectory=%@",documentDirectory);
}



@end
