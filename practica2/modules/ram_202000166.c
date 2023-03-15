#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/sysinfo.h>
#include <linux/swap.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo para obtener infor de ram, practica 2 - so1");
MODULE_AUTHOR("Gerson Ruben Quiroa del Cid");

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    struct sysinfo ram;
    si_meminfo(&ram);
    seq_printf(archivo, "{");
    seq_printf(archivo, "\n\"totalram\": %lu,", ram.totalram * ram.mem_unit);
    seq_printf(archivo, "\n\"freeram\": %lu", ram.freeram * ram.mem_unit);
    seq_printf(archivo, "\n}\n");
    return 0;
}

// funcion que se ejecuta cuando se le hace un cat al modulo.
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("ram_202000166", 0666, NULL, &operaciones);
    printk(KERN_INFO "Carnet: 202000166 \n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("ram_202000166", NULL);
    printk(KERN_INFO "Sistemas Operativos 1\n");
}

module_init(_insert);
module_exit(_remove);