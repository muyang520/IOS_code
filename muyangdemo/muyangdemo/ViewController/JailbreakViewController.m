//
//  JailbreakViewController.m
//  muyangdemo
//
//  Created by yangshuang on 2023/7/31.
//

#import "JailbreakViewController.h"
#include <sys/stat.h>
#include "../CommonUtil/AppInfo.h"
#include "../CommonUtil/FileAndFolderPathDetection.h"
#import <dlfcn.h>

#pragma mark - 越狱检测

#define ARRAY_SIZE(a) sizeof(a)/sizeof(a[0])

const char* jailbrokenFiles[] = {
    "/Applications/Cydia.app",
    "/Applications/Sileo.app",
    "/Library/MobileSubstrate/MobileSubstrate.dylib",
    "/bin/bash",
    "/usr/sbin/sshd",
    "/etc/apt",
    
    "/var/mobile/Library/Cydia",
    "/private/var/lib/cydia",
    "/var/lib/cydia",
    // TODO 可以添加更多文件列表
};

const char*  plugin_apps[] = {
    "unc0ver",
    "checkra1n",
    "Cydia",
    "Sileo",
    "Substitute",
    "CrackerXI+",
    "DumpDecrypter",
    "Flex"
};


#pragma mark 使用NSFileManager通过检测一些越狱后的关键文件是否可以访问来判断是否越狱
BOOL isJailbroken1() {
    for (int i=0; i<ARRAY_SIZE(jailbrokenFiles); i++) {
        if ([[NSFileManager defaultManager] fileExistsAtPath:[NSString stringWithUTF8String:jailbrokenFiles[i]]]) {
            NSLog(@"muyangdemo设备已越狱,相关=>%s",jailbrokenFiles[i]);
            return YES;
        }
    }
    NSLog(@"设备未越狱");
    return NO;
}

#pragma mark 使用stat通过检测一些越狱后的关键文件是否可以访问来判断是否越狱
BOOL isJailbroken2() {
    //判断stat的来源是否来自于系统库，因为fishhook通过交换函数地址来实现hook，若hook了stat，则stat来源将指向攻击者注入的动态库中
    int ret ;
    Dl_info dylib_info;
    int (*func_stat)(const char *, struct stat *) = stat;
    if ((ret = dladdr(func_stat, &dylib_info))) {
        NSString *fName = [NSString stringWithUTF8String:dylib_info.dli_fname];
        NSLog(@"fname--%@",fName);
        if(![fName isEqualToString:@"/usr/lib/system/libsystem_kernel.dylib"]){
            return YES;
        }
    }
    
    for (int i=0; i<ARRAY_SIZE(jailbrokenFiles); i++) {
        struct stat stat_info;
        //获取文件信息判断
        if (stat(jailbrokenFiles[i], &stat_info) == 0) {
            NSLog(@"muyangdemo设备已越狱,相关=>%s",jailbrokenFiles[i]);
            return YES;
        }
    }
    
    return NO;
}

#pragma mark 使用多种C函数来判断进程是否存在
BOOL isJailbroken3() {
//    if ([[NSFileManager defaultManager] fileExistsAtPath:@"/Applications/"]) {
//       
//    }
    for (int i=0; i<ARRAY_SIZE(plugin_apps); i++) {
        JailbreakViewController *jail = [[JailbreakViewController alloc]init];
        if ([jail checkPluginAppIsInstalled:[NSString stringWithUTF8String:plugin_apps[i]]]){
            NSLog(@"muyangdemo设备已越狱,相关=>%s",plugin_apps[i]);
            return YES;
        }
    }
    NSLog(@"设备未越狱");
    return NO;
}
#pragma mark 通过URLSchemes检测是否越狱
BOOL isJailbroken4() {
    if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"cydia://"]]) {
        NSLog(@"设备已越狱");
        return YES;
    }
    return NO;
}


@interface JailbreakViewController ()
@property (weak, nonatomic) IBOutlet UITextField *TextJailbreak;

@end

@implementation JailbreakViewController

-(BOOL)checkPluginAppIsInstalled:(NSString *)plugin_app{
    
    // 常用越狱插件 APP 名单
    /**
         "/private/var/containers/Bundle/Application/8F5EEA8B-F7A5-4D0E-94EA-481BE7154ABA/unc0ver.app",
         "/private/var/binpack/Applications/loader.app",
         "/Applications/Cydia.app",
         "/Applications/Sileo.app",
         "/Applications/SubstituteSettings.app",
         "/Applications/crackerxi.app",
         "/Applications/DumpDecrypter.app",
         "/Applications/Flex.app"
     */
    
    NSString *path = @"/Applications/";
    FileAndFolderPathDetection *detection = [[FileAndFolderPathDetection alloc] init];
    
    // 遍历判断 unc0ver
    if([plugin_app isEqual:@"unc0ver"]){
        
        // 列出当前手机上所有非 iOS 系统的 APP，并且在 /private/var/containers/Bundle/Application 这个目录下的
        AppInfo *appInfo = [[AppInfo alloc] init];
        NSArray *apps = [appInfo listInstalledApps];
        
        // 补全 .app 后缀
        plugin_app = @"unc0ver.app";
        if ([apps containsObject:plugin_app]) {
            return YES;
        }
        
        return NO;
    }
    
    if ([plugin_app isEqual:@"checkra1n"]) {
        // checkra1n 的安装路径
        path = @"/private/var/binpack/Applications/loader.app";
    } else if ([plugin_app isEqual:@"Substitute"]) {
        // Substitute 的安装路径
        path = [path stringByAppendingString:@"SubstituteSettings.app"];
    } else if ([plugin_app isEqual:@"CrackerXI+"]) {
        // CrackerXI+ 的安装路径
        path = [path stringByAppendingString:@"crackerxi.app"];
    } else {
        // 补全 .app 后缀
        plugin_app = [plugin_app stringByAppendingString:@".app"];
        // 其他 APP 路径
        path = [path stringByAppendingString:plugin_app];
    }
    
    if ([detection checkPathByNSFileManager:path] ||
        [detection checkPathByAccess:path] ||
        [detection checkPathByStat:path] ||
        [detection checkPathByLstat:path] ||
        [detection checkPathByStatfs:path] ||
        [detection checkPathByOpen:path] ||
        [detection checkPathByFopen:path]
        ) {
        return YES;
    }
    
    return NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}

- (IBAction)button_Jailbreak_File:(id)sender {
    if(isJailbroken1()){
        self.TextJailbreak.text = @"方法1已越狱。具体看日志";
    }else if(isJailbroken2()){
        self.TextJailbreak.text = @"方法2已越狱。具体看日志";
    }else{
        self.TextJailbreak.text = @"未越狱";
    }
 
}

- (IBAction)button_Jailbreak_process:(id)sender {
    if(isJailbroken3()){
        self.TextJailbreak.text = @"方法3已越狱。具体看日志";
    }else{
        self.TextJailbreak.text = @"未越狱";
    }
}
- (IBAction)button_Jailbreak_URLSchemes:(id)sender {
    if(isJailbroken4()){
        self.TextJailbreak.text = @"方法4已越狱。具体看日志";
    }else{
        self.TextJailbreak.text = @"未越狱";
    }
}

bool isJailbroken_huanjing(){
    if(TARGET_IPHONE_SIMULATOR)return NO;
    return !(NULL == getenv("DYLD_INSERT_LIBRARIES"));
}
- (IBAction)button_jailbreak_huanjing:(id)sender {
    if(isJailbroken_huanjing()){
        self.TextJailbreak.text = @"检测到环境。具体看日志";
    }else{
        self.TextJailbreak.text = @"未越狱";
    }
    
    int f;
    // 函数执行成功返回打开的文件句柄，-1 打开失败
    f=open([@"/System/Library/Frameworks/CFNetwork.framework/zh_CN.lproj/Localizable.strings" UTF8String], O_RDONLY);
    
    close(f);
}


@end
