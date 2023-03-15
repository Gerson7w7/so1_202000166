#include <linux/module.h>
#define INCLUDE_VERMAGIC
#include <linux/build-salt.h>
#include <linux/elfnote-lto.h>
#include <linux/export-internal.h>
#include <linux/vermagic.h>
#include <linux/compiler.h>

BUILD_SALT;
BUILD_LTO_INFO;

MODULE_INFO(vermagic, VERMAGIC_STRING);
MODULE_INFO(name, KBUILD_MODNAME);

__visible struct module __this_module
__section(".gnu.linkonce.this_module") = {
	.name = KBUILD_MODNAME,
	.init = init_module,
#ifdef CONFIG_MODULE_UNLOAD
	.exit = cleanup_module,
#endif
	.arch = MODULE_ARCH_INIT,
};

#ifdef CONFIG_RETPOLINE
MODULE_INFO(retpoline, "Y");
#endif


static const struct modversion_info ____versions[]
__used __section("__versions") = {
	{ 0x92997ed8, "_printk" },
	{ 0x5b8239ca, "__x86_return_thunk" },
	{ 0x98c9e37c, "single_open" },
	{ 0x40c7247c, "si_meminfo" },
	{ 0xc6bc5007, "seq_printf" },
	{ 0xa19b956, "__stack_chk_fail" },
	{ 0x6253c38c, "remove_proc_entry" },
	{ 0x8523cf72, "seq_read" },
	{ 0xbdfb6dbb, "__fentry__" },
	{ 0xedb74c9f, "proc_create" },
	{ 0xb3debb2c, "module_layout" },
};

MODULE_INFO(depends, "");


MODULE_INFO(srcversion, "D7C791B965661824BEF6381");
