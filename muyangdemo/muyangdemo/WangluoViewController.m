//
//  WangluoViewController.m
//  muyangdemo
//
//  Created by yangshuang on 2023/7/17.
//

#import "WangluoViewController.h"
#import "Network/AgentDetection.h"

@interface WangluoViewController ()

@end

@implementation WangluoViewController

- (void)viewDidLoad {
    NSLog(@"jinlai111");
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}
int add(int a,int b){
    return a+b;
}
- (IBAction)jiancedaili:(id)sender {
    NSLog(@"nmia%d",add(1,2));
    AgentDetection *agent = [[AgentDetection alloc]init];
    self.label_zhuangtai.text = [agent setConnectionProxyDictionary];
    
}


@end
