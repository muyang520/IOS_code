//
//  FridaDeteViewController.m
//  muyangdemo
//
//  Created by yangshuang on 2023/8/7.
//

#import "FridaDeteViewController.h"
#include <sys/socket.h>
#include <arpa/inet.h>
#include "../CommonUtil/FileAndFolderPathDetection.h"

#define ARRAY_SIZE(a) sizeof(a)/sizeof(a[0])

@interface FridaDeteViewController ()
@property (weak, nonatomic) IBOutlet UITextField *TextView1;

@end

@implementation FridaDeteViewController

#define ARRAY_SIZE(a) sizeof(a)/sizeof(a[0])

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (IBAction)button_checkport:(id)sender {
    int s = socket(AF_INET, SOCK_STREAM, 0);
        if(s == -1){
            NSLog(@"socket fail!");
            close(s);
        }
        
        struct sockaddr_in addr;
        addr.sin_family = AF_INET;          // AF_INET ipv4
        addr.sin_addr.s_addr = inet_addr("127.0.0.1");
        addr.sin_port = htons(27042);       // 终端输入 ns -l 27042
        
        /**
            1 发送一个信号给服务端，在吗（ACK）
            2 服务端回一个（ACK）我在
            3 客服端，那我们就开始吧
         
            0: 连接成功  -1: 连接失败
         */
        int result = connect(s, (struct sockaddr *)&addr, sizeof(addr));
        
        if (result == -1) {
            NSLog(@"connect fail");
            close(s);
            self.TextView1.text = @"27042端口检测不到";
           
        }else{
            self.TextView1.text = @"27042端口检测到了";
        }
        close(s);
}

- (IBAction)button_FileCheck:(id)sender {
    const char*  paths[] = {
        "/usr/sbin/frida-server",
        "/usr/lib/frida/frida-server",
        "/usr/lib/frida/frida-agent.dylib",
        "/Library/LaunchDaemons/re.frida.server.plist",
        "/Library/dpkg/info/re.frida.server.extrainst_",
        "/Library/dpkg/info/re.frida.server.list",
        "/Library/dpkg/info/re.frida.server.prerm",
        "/Library/dpkg/info/re.frida.server.md5sums"
    };
    FileAndFolderPathDetection *detection = [[FileAndFolderPathDetection alloc] init];
    
    for (int i=0; i<ARRAY_SIZE(paths); i++) {
        if ([detection checkPathByNSFileManager:[NSString stringWithUTF8String:paths[i]]] ||
            [detection checkPathByAccess:[NSString stringWithUTF8String:paths[i]]] ||
            [detection checkPathByStat:[NSString stringWithUTF8String:paths[i]]] ||
            [detection checkPathByLstat:[NSString stringWithUTF8String:paths[i]]] ||
            [detection checkPathByStatfs:[NSString stringWithUTF8String:paths[i]]] ||
            [detection checkPathByOpen:[NSString stringWithUTF8String:paths[i]]] ||
            [detection checkPathByFopen:[NSString stringWithUTF8String:paths[i]]]
            ) {
            self.TextView1.text = @"文件检测到了";
        }
    }
    
}

@end
