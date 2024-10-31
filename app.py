from pywinauto import Application
import datetime
import time
from subprocess import call

def cerrarApp(dlg_app, arch_log):
    dlg_app.close()
        
    button_confirm_close = dlg_app.child_window(title="Sí", control_type="Button")
    button_confirm_close.wait("enabled", timeout=1000).click_input()

    if arch_log:
        arch_log.write(str(datetime.datetime.now()) + ": Cerrando ZkAccess3.5\n")
        arch_log.close()

def registrarError(error):
    error_log = open("./logs/error/"+str(datetime.date.today()) + ".log", "a")
    error_log.write(str(datetime.datetime.now()) + ' ERROR: ' + str(error) + "\n")
    error_log.close()

def descargaEventos(dlg,arch):
    try:
        arch = open("./logs/exec/"+str(datetime.date.today()) + ".log", "a")
        
        app = Application(backend='uia').start(r"C:\ZKTeco\ZKAccess3.5\Access.exe")
        arch.write(str(datetime.datetime.now()) + ": Abriendo ZKAccess 3.5\n")

        dlg = app.window()

        time.sleep(2)  
        try:
            try:
                button_aceptar_dialog = dlg.child_window(title="Aceptar", control_type="Button")
                button_aceptar_dialog.wait('visible', timeout=5)  
                button_aceptar_dialog.click_input()
                arch.write(str(datetime.datetime.now()) + ": Cierro popup\n")
            except Exception as e:
                if 'ElementNotFoundError' in str(e):
                    arch.write(str(datetime.datetime.now()) + ": El botón 'Aceptar' no se encontró.\n")
                else:
                    registrarError(e)
            button_inicio_sesion = dlg.child_window(title="Inicio de Sesión", control_type="Button")
            button_inicio_sesion.wait('visible', timeout=5)  
            button_inicio_sesion.click_input()
            arch.write(str(datetime.datetime.now()) + ": Inicio sesion\n")

            disp = dlg.child_window(auto_id="pic_device", control_type="Pane")
            disp.wait("enabled", timeout=600).click_input()
            arch.write(str(datetime.datetime.now()) + ": Pestana dispositivos\n")

            check_dispositivos = dlg.child_window(title="check", control_type="Header")
            check_dispositivos.wait("enabled", timeout=600).click_input()
            arch.write(str(datetime.datetime.now()) + ": Selecciono dispositivos\n")

            check_inbio = dlg.child_window(title="check row 1", control_type="DataItem")
            check_inbio.wait("enabled", timeout=600).click_input()
            arch.write(str(datetime.datetime.now()) + ": Deselecciono inbio\n")

            button_descargar = dlg.child_window(title="Descargar eventos", control_type="Button")
            button_descargar.wait("enabled", timeout=600).click_input()
            arch.write(str(datetime.datetime.now()) + ": Pestana descargar eventos\n")

            # ********************
            # *     ATENCION     *
            # ********************
            
            # Descomentar las siguientes lineas significa descargar los eventos y borrarlos.
            # No usar mientras se está probando el sistema con los relojes en producción. 
            # Ya que el Agente CCZK no podrá leer los registros.

            check_eliminar_despues_descarga = dlg.child_window(title="Eliminar los eventos después de descargar", control_type="CheckBox")
            check_eliminar_despues_descarga.wait("enabled", timeout=600).click_input()
            arch.write(str(datetime.datetime.now()) + ": Selecciono eliminar los eventos después de descargar\n")

            confirm_descarga = dlg.child_window(auto_id="btn_DownLoad", control_type="Button")
            confirm_descarga.wait("enabled", timeout=600).click_input()
            arch.write(str(datetime.datetime.now()) + ": Descargando...\n")

            button_regresar = dlg.child_window(auto_id="btn_exit", control_type="Button")
            button_regresar.wait("enabled", timeout=1000).click_input()
            arch.write(str(datetime.datetime.now()) + ": Finalizo la descarga\n")

        except Exception as e:
            registrarError(e)
            if dlg:
                cerrarApp(dlg, arch)
        finally:
            if dlg:
                cerrarApp(dlg, arch)
    except Exception as e:
        if dlg:
            cerrarApp(dlg, arch)
        registrarError(e)

dlg = None  
arch = None 
try:
    descargaEventos(dlg, arch)
    call(["node", "./app.js"]) 
except Exception as e:
    registrarError(e)