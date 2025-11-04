package springfut.model;

import java.time.LocalTime;

public class Pelada {
    private int idPelada;
    private String diaSemana;
    private LocalTime horario;
    private double valorTotal;
    private int limiteMensalistas;
    private int tempoConfMensalista;
    private int tempoConfDiarista;

    
    public int getIdPelada() { return idPelada; }
    public void setIdPelada(int idPelada) { this.idPelada = idPelada; }

    public String getDiaSemana() { return diaSemana; }
    public void setDiaSemana(String diaSemana) { this.diaSemana = diaSemana; }

    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }

    public double getValorTotal() { return valorTotal; }
    public void setValorTotal(double valorTotal) { this.valorTotal = valorTotal; }

    public int getLimiteMensalistas() { return limiteMensalistas; }
    public void setLimiteMensalistas(int limiteMensalistas) { this.limiteMensalistas = limiteMensalistas; }

    public int getTempoConfMensalista() { return tempoConfMensalista; }
    public void setTempoConfMensalista(int tempoConfMensalista) { this.tempoConfMensalista = tempoConfMensalista; }

    public int getTempoConfDiarista() { return tempoConfDiarista; }
    public void setTempoConfDiarista(int tempoConfDiarista) { this.tempoConfDiarista = tempoConfDiarista; }
}