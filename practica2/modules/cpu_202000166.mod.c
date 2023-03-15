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
	{ 0xc4f0da12, "ktime_get_with_offset" },
	{ 0x944375db, "_totalram_pages" },
	{ 0xc6bc5007, "seq_printf" },
	{ 0x62c5011c, "init_task" },
	{ 0x129958b6, "get_task_cred" },
	{ 0x3fc0f1d3, "get_task_mm" },
	{ 0x6253c38c, "remove_proc_entry" },
	{ 0x8523cf72, "seq_read" },
	{ 0xbdfb6dbb, "__fentry__" },
	{ 0xedb74c9f, "proc_create" },
	{ 0xb3debb2c, "module_layout" },
};

MODULE_INFO(depends, "");


MODULE_INFO(srcversion, "8EBB9DBB4E18AF54334ECB5");
