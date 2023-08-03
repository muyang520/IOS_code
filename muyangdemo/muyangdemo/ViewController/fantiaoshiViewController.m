//
//  fantiaoshiViewController.m
//  muyangdemo
//
//  Created by yangshuang on 2023/7/26.
//

#import "fantiaoshiViewController.h"

#include <dlfcn.h>
#include <sys/sysctl.h>
#include <sys/syscall.h>

#ifndef PT_DENY_ATTACH
#define PT_DENY_ATTACH 31
#endif

@interface fantiaoshiViewController ()

@end

// 方法1
// 声明ptrace函数，否则不能编译
int ptrace(int _request, pid_t _pid, caddr_t _addr, int _data);
void Anti0() {
    ptrace(PT_DENY_ATTACH, 0, 0, 0);
}

// 方法2
//首先，通过dlopen函数将动态链接库加载到进程中。其中，参数0表示加载当前进程的符号表。
//然后，使用dlsym函数获取ptrace函数的地址，并将其转换为函数指针类型ptrace_ptr_t。
//最后，通过调用ptrace_ptr函数，传入参数PT_DENY_ATTACH，将其它参数设为0来禁止附加到当前进程。
void Anti1() {
    typedef int (*ptrace_ptr_t)(int _request, pid_t _pid, caddr_t _addr, int _data);
    void *handle = dlopen(0, RTLD_GLOBAL | RTLD_NOW);
    ptrace_ptr_t ptrace_ptr = (ptrace_ptr_t)dlsym(handle, "ptrace");
    ptrace_ptr(PT_DENY_ATTACH, 0, 0, 0);
}

//检测是否被附加 Yes表示被附加了
BOOL isAttached(void){
    int name[4];             //里面放字节码。查询的信息
    name[0] = CTL_KERN;      //内核查询
    name[1] = KERN_PROC;     //查询进程
    name[2] = KERN_PROC_PID; //传递的参数是进程的ID
    name[3] = getpid();      //获取当前进程ID
    struct kinfo_proc info;  //接受查询结果的结构体
    size_t info_size = sizeof(info);  //结构体大小
    if(sysctl(name,4, &info, &info_size, 0, 0)){
        NSLog(@"查询失败");
        return NO;
    }
    /*
     查询结果看info.kp_proc.p_flag 的第12位，如果为1，表示调试附加状态。
     info.kp_proc.p_flag & P_TRACED 即可获取第12位
    */
    return ((info.kp_proc.p_flag & P_TRACED) != 0);
}

void Anti3() {
    syscall(SYS_ptrace, PT_DENY_ATTACH, 0, 0, 0);
}

void Anti4() {
#ifdef __arm64__
    asm(
        "mov x0,#31\n"
        "mov x1,#0\n"
        "mov x2,#0\n"
        "mov x3,#0\n"
        "mov w16,#26\n" // 26-->ptrace
        "svc #0x80"     // 0x80触发中断去找w16执行
        );
#endif
}


void Anti6() {
    if (isatty(STDOUT_FILENO)) {
        exit(0);
    }
}
@implementation fantiaoshiViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
//    Anti0();
    Anti1();
//
//    if(isAttached()){
//            NSLog(@"检测到附加，收集手机信息等数据给后台");
//        }
    Anti3();
//    Anti4();
//    Anti6();
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
