#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/sched.h>
#include <linux/sched/signal.h>
#include <linux/types.h>
#include <linux/timekeeping.h>
#include <linux/time.h>
#include <linux/cred.h>
#include <linux/sched/user.h>
#include <linux/slab.h>
#include <linux/security.h>
#include <linux/pid.h>
#include <linux/fs.h>
#include <linux/uidgid.h>
#include <linux/mm_types.h>
#include <linux/mm.h>
#include <linux/sched/mm.h> 

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo para obtener infor de cpu, practica 2 - so1");
MODULE_AUTHOR("Gerson Ruben Quiroa del Cid");

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    struct task_struct *task = current;
    struct task_struct *task_child;
    struct list_head *list;
    unsigned long long total_cpu_time = 0;
    unsigned long long uptime = 0;
    unsigned long long starttime = 0;
    unsigned long long hertz = HZ;
    unsigned long long seconds = 0;
    unsigned long long cpu_usage = 0;
    // contadores para los procesos
    int running_processes = 0;
    int sleeping_processes = 0;
    int stopped_processes = 0;
    int zombie_processes = 0;
    int total_processes = 0;
    // info sobre el proceso
    struct pid *pid;
    int pid_num;
    // usuario de cada proceso
    const struct cred *cred;
    uid_t uid;
    // ram utilizada
    unsigned long rss, total_size, total_ram;
    struct mm_struct *mm;
    // bools para obtener el json de forma correcta
    bool flag, flag2;

    // Obtener el uptime del sistema
    uptime = ktime_to_ms(ktime_get_boottime()) / 1000;
    // obtener cantidad total de RAM del sistema
    total_ram = (*totalram_pages)() * PAGE_SIZE;

    seq_printf(archivo, "{");
    seq_printf(archivo, "\n\"procesos\": [\n");
    // Calcular el tiempo de CPU utilizado por cada proceso y sumarlo
    flag = false;
    for_each_process(task) {
        // Obtener el PID del proceso
        pid = task_pid(task);
        pid_num = pid_nr(pid);
        // Obtener la información del usuario que ejecutó el proceso
        cred = get_task_cred(task);
        uid = cred->uid.val;

        // tiempo total del cpu
        total_cpu_time += task->utime + task->stime;

        // ram usada por el proceso
        mm = get_task_mm(task);
        if (mm)
        {
            // obtener la cantidad de páginas de memoria RAM utilizadas por el proceso
            rss = get_mm_rss(mm);
            // obtener el tamaño total en bytes
            total_size = rss * PAGE_SIZE;
        }

        // escribimos en el archivo
        if (flag)
        {
            seq_printf(archivo, ",");
        }
        flag = true;
        seq_printf(archivo, "\n\t{\"pid\": %d,", pid_num);
        seq_printf(archivo, "\n\t\"name\": \"%s\",", task->comm);
        seq_printf(archivo, "\n\t\"uid\": %u,", uid);
        seq_printf(archivo, "\n\t\"ram_usada\": {"); // porcentaje = total_size * 100 / total_ram
        seq_printf(archivo, "\n\t\t\"totalram\": %lu,", total_ram);
        seq_printf(archivo, "\n\t\t\"freeram\": %lu", total_size);
        seq_printf(archivo, "\n\t\t},");
        // Verificar el estado del proceso
        if (task->state == TASK_RUNNING || task->state == TASK_WAKEKILL) {
            // contamos los procesos que estan corriendo
            running_processes++;
            seq_printf(archivo, "\n\t\"estado\": \"corriendo\",");
        } else if (task->state == TASK_INTERRUPTIBLE || task->state == TASK_UNINTERRUPTIBLE) {
            // contamos los procesos que estan dormidos
            sleeping_processes++;
            seq_printf(archivo, "\n\t\"estado\": \"dormido\",");
        } else if (task->state == TASK_STOPPED) {
            // contamos los procesos que estan detenidos
            stopped_processes++;
            seq_printf(archivo, "\n\t\"estado\": \"detenido\",");
        } else if (task->state == TASK_DEAD && task->parent == &init_task) {
            // contamos los procesos que estan en modo zombie
            zombie_processes++;
            seq_printf(archivo, "\n\t\"estado\": \"zombie\",");
        } else {
            seq_printf(archivo, "\n\t\"estado\": \"wakekill\",");
        }
        // obteniendo hijos (si tuviera)
        flag2 = false;
        seq_printf(archivo, "\n\t\"hijos\": [");
        list_for_each(list, &task->children)
        {
            if (flag2)
            {
                seq_printf(archivo, ",");
            }
            flag2 = true;
            task_child = list_entry(list, struct task_struct, sibling);
            seq_printf(archivo, "\n\t\t{\"pid\": %d,", task_child->pid);
            seq_printf(archivo, "\n\t\t\"nombre\": \"%s\" }", task->comm);
        }
        seq_printf(archivo, "\n\t\t]");
        seq_printf(archivo, "\n\t}");
    }
    seq_printf(archivo, "\n],");
    // Calcular el número de segundos desde el inicio del sistema
    starttime = ktime_to_ms(ktime_get_boottime()) / 1000;
    seconds = uptime - (starttime / hertz);
    // cpu_usage_percent = (cpu_usage / (seconds * hertz)) * 100
    // Calcular el porcentaje de uso de CPU
    if (seconds > 0) {
        cpu_usage = 100 * ((total_cpu_time / hertz) / seconds);
    }
    // procesos totales 
    total_processes = running_processes + sleeping_processes + stopped_processes + zombie_processes;

    seq_printf(archivo, "\n\"cpu_usage\": %llu,", cpu_usage); // dividir entre 1000000
    seq_printf(archivo, "\n\"running_processes\": %d,", running_processes);
    seq_printf(archivo, "\n\"sleeping_processes\": %d,", sleeping_processes);
    seq_printf(archivo, "\n\"stopped_processes\": %d,", stopped_processes);
    seq_printf(archivo, "\n\"zombie_processes\": %d,", zombie_processes);
    seq_printf(archivo, "\n\"total_processes\": %d", total_processes);
    seq_printf(archivo, "\n}\n");
    return 0;
}

// Funcion que se ejecuta cuando se le hace un cat al modulo.
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

static const struct file_operations operaciones =
    {
        .open = al_abrir,
        .read = seq_read,
};

static int _insert(void)
{
    proc_create("cpu_202000166", 0666, NULL, &operaciones);
    printk(KERN_INFO "Gerson Ruben Quiroa del Cid \n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("cpu_202000166", NULL);
    printk(KERN_INFO "Primer Semestre 2023 \n");
}

module_init(_insert);
module_exit(_remove);